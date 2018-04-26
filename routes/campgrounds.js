var express = require("express");
var router  = express.Router();
var Campground      = require("../models/campground");
var middleWare      = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//LIST all campgrounds
router.get("/campgrounds",function(req,res){
    
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  req.flash("error","No campgrounds match that query, please try again.") ;
              }
              res.render("campground/allCampgrounds",{campgrounds:allCampgrounds});
           }
        });
    }else{
    Campground.find({},function(err,allcamps){
       if(err)
          console.log(err);
       else
           res.render("campground/allCampgrounds",{campgrounds:allcamps});
    });
    }
});

//CREATE - add new campground to DB
router.post("/campgrounds", middleWare.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var cost= req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author,location: location, lat: lat, lng: lng,cost:cost};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});


//ADD a new campground
router.get("/campgrounds/new",middleWare.isLoggedIn,function(req,res){
    res.render("campground/newCampground");
});

//SHOW a campground
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp);
            res.render("campground/showCampground",{campground:foundCamp});
        }
    })
});



//DELETE campground
router.delete("/campgrounds/:id",middleWare.checkCampgroundOwnership,function(req,res){
     Campground.findByIdAndRemove(req.params.id,function(err,deleted){
         req.flash("success","Campground deleted!");
             res.redirect("/campgrounds");
     });
});

//go to EDIT page
router.get("/campgrounds/:id/edit",middleWare.checkCampgroundOwnership,function(req,res){
    //save route from misuse i.e prevent unauthorized user from editing it THEREFORE we have used middleware
    Campground.findById(req.params.id,function(err,found){
         res.render("campground/editCampground",{campground:found});
    });
});


// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleWare.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
    
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports  = router;