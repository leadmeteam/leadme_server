var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({

    //guide_id : {type : String, default : ""},
    email: {type: String, requried: true},
    first_name: {type: String, requried: true},
    last_name: {type: String, required: true},
    pic_url: {type: String, required: true},
    guide_id:{type:String,default:""},
    facebook_id:{type:String,default:""}
});

module.exports = mongoose.model('user',userSchema);