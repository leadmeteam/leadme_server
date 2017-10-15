var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var FeedShcema = new Schema({
    userId : {type:String, required : true},//작성자 id
    district : {type:String, required : true},//피드 기준=장소 (기준 추가 예정)
    createdDate : {type :Date, default : Date.now},
    feedBody : {type :String, default : ""},
    like : {type : String,default : "0"},
    comment : [{
        userId : {type:String},//댓글 단 사람의 User._id
        commentBody : {type:String},
        pic_url:{type:String},
        userName : {type:String},
        comment_likes : {type:String,default : "0"}
    }]
});
module.exports = mongoose.model('feed', FeedShcema);