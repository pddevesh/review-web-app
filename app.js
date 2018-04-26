require('dotenv').config();

var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var Passport        = require("passport");
var mongoose        = require("mongoose");
var LocalStrategy   = require("passport-local");
var User            = require("./models/user");
var expressSanitizer    =require("express-sanitizer");
var methodOverride      = require("method-override");
var flash               = require("connect-flash");

var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    authRoutes          = require("./routes/authentication")

mongoose.connect("mongodb://localhost/yelpCamp");

//PASSPORT config
app.use( require("express-session")({
    secret              : " You will never know my encrytion Algorithm",
    resave              : false,
    saveUninitialized   : false
}));

app.use(Passport.initialize());
app.use(Passport.session());
Passport.use(new LocalStrategy(User.authenticate()));
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(expressSanitizer());
app.use(flash());


app.use(function(req,res,next){
   res.locals.currentUser = req.user;   //whatever is inside locals are acccessible across VIEW files
   res.locals.error   =req.flash("error");
   res.locals.success  = req.flash("success");
   next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


app.listen(3000,function(){
    console.log("YelpCamp server has started");
});