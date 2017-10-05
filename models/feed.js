var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var FeedScema = new Scema({
    userId : {type:String, required : true},//작성자 id
    standard : {type:String, required : true},
    createdDate : {type :Date, default : Date.now},
    feedBody : {type :String, default : ""},
    like : {type : String,default : "0"},
    comment : [{
        commnetId:{type:String},
        userId : {type:String},
        commentBody : {type:String},
    }]
});
module.exports = mongoose.model('feed', FeedSchema);