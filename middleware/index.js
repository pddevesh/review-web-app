var Campground  = require("../models/campground");
var Comments    = require("../models/comments");
//all the middlewares
var middleWare={};

middleWare.checkCampgroundOwnership = function (req,res,next) {
     if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,found){
           if(err){
                 req.flash("error","Campground not found");
                 res.redirect("/campgrounds");
           }
            else if(found.author.id.equals(req.user._id))
                    next();
            else{
                 req.flash("error","You don't have the permission to do that!");
                 res.redirect("back");
            }
        });
    }else{
          req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middleWare.checkCommentOwnership    = function (req,res,next) {
     if(req.isAuthenticated()){
        Comments.findById(req.params.id2,function(err,foundComment){
              if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
              }
              else if(foundComment.author.id.equals(req.user._id))   
                    next();
              else{
                  req.flash("error","You don't have the permission to do that!");
                  res.redirect("back");
              }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middleWare.isLoggedIn   =function(req,res,next){
    
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}


module.exports = middleWare ;