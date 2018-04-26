var mongoose    = require("mongoose");

var campgroundSchema= mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    lat :Number,
    lng: Number,
    cost: Number,
    author: {
        id:{
            type :mongoose.Schema.Types.ObjectId,
            ref : "Users"
        },
        username : String
    },
    
    comments :[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref  : "Comments"
            }
        ]
});

module.exports  = mongoose.model("Campground",campgroundSchema); 