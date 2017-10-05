var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var guideSchema = new Schema({

    user_id: {type: String},
    district: [{
        placeName: {type: String},
        confidence: {type: String},//자신있는 정도

    }],
    language : [{
        languageName : {type:String},
        languageSkill : {type:String},

    }]

});

module.exports = mongoose.model('guide', guideSchema);