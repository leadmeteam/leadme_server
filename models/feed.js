var mongoose = require('mongoose');
mongoose.Promise = Promise;
var User = require('./user');
var Schema = mongoose.Schema;

var FeedShcema = new Schema({
    userId: {type: String, required: true},//작성자 id
    district: {type: String, required: true},//피드 기준=장소 (기준 추가 예정)
    createdDate: {type: Date, default: Date.now},
    feedBody: {type: String, default: ""},

    likes: [String],

    comment: [{
        first_name : {type:String},
        last_name : {type:String},
        userId: {type: String},//댓글 단 사람의 User._id
        commentBody: {type: String},
        pic_url: {type: String},
        userName: {type: String},
        comment_likes: {type: String, default: "0"},
        createdDate: {type: Date, default: Date.now}
    }],

    feed_pic_url: {type: String, default: ""},
    writer: {type: Schema.Types.ObjectId, ref: 'user'}
});
module.exports = mongoose.model('feed', FeedShcema);