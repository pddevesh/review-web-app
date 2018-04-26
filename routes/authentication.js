var Passport        = require("passport");
var User            = require("../models/user");
var express         = require("express");
var router          = express.Router();




//root route
router.get("/",function(req,res){
    res.render("landing");
});


//AUTH routes//

//show login form
router.get("/login",function(req, res) {
    res.render("login");
});


//LOGIN user
router.post("/login",Passport.authenticate("local",{
            successRedirect : "/campgrounds",
            failureRedirect : "/login"
    }),function(req, res) {
});

//open signup page
router.get("/register",function(req,res){
    
    res.render("register");
});

//LOGOUT route

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/campgrounds");
});

//REGISTER
router.post("/register",function(req,res){
        var newuser =new User({username : req.body.username});
        User.register(newuser , req.body.password, function(err,newuser){
            if(err){
                req.flash("error",err.message);
                return res.render("register");
                }else{
                        Passport.authenticate("local")(req,res,function(){
                            req.flash("success","Welcome to  YelpCamp "+newuser.username);
                           res.redirect("/campgrounds");
                        });
            }    
        });
});


module.exports  = router;