var express = require("express");
var router  = express.Router();
var Campground      = require("../models/campground");
var Comments        = require("../models/comments"); 
var middleWare      = require("../middleware")   //since file name is index.js , no need to specify
// CREATE COMMENT
router.get("/campgrounds/:id/comment/new",middleWare.isLoggedIn,function(req,res){
        
        Campground.findById(req.params.id,function(err,campground){
           if(err)
                    console.log(err);
            else{
                res.render("comments/newComment",{campground : campground});
            }        
        });
});
//POST comment
router.post("/campgrounds/:id/comment",middleWare.isLoggedIn,function(req,res){
         Campground.findById(req.params.id,function(err,campground){
             if(err){
                 console.log(err);
             }
             else{
                 Comments.create(req.body.comment,function(err,comment){
                    if(err){
                        console.log(err);
                    } else{
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        console.log(comment);
                        req.flash("success","Comment posted!");
                        res.redirect("/campgrounds/"+campground._id);
                    }
                 });
             }
         });
});

//COMMENT PUT route
router.put("/campgrounds/:id/comments/:id2",middleWare.checkCommentOwnership,function(req,res){
        Comments.findByIdAndUpdate(req.params.id2,req.body.comment,function(err,comment){
                req.flash("success","Comment edited and saved!");
                res.redirect("/campgrounds/"+req.params.id);
        });
});

//DELETE comment
router.delete("/campgrounds/:id/comments/:id2",middleWare.checkCommentOwnership,function(req,res){
        Comments.findByIdAndRemove(req.params.id2,function(err,comment){
            req.flash("success","Comment deleted!");
                res.redirect("/campgrounds/"+req.params.id);
        });
});


// goto comment EDIT page
router.get("/campgrounds/:id/comments/:id2/edit",middleWare.checkCommentOwnership,function(req,res){
        Comments.findById(req.params.id2,function(err, foundComment) {
                 res.render("comments/editComment",{campground_id: req.params.id , comment : foundComment })
        }) ;      
});



module.exports  = router;