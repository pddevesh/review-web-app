var mongoose = require("mongoose");

var commentsSchema = mongoose.Schema({
    text    :String,
    author  : {
                id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "Users"
                } ,
                username : String
    },
    created : {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comments",commentsSchema);