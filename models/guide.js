var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var guideSchema = new Schema({
  name: {
    type: String,
    requried: true
  },
  image: { // profile image <- userDB.image or upload
    data: Buffer,
    contentType: String
  },
  userName: { // name of userDB
    type: String,
    requried: true
  },
  languages: [{ // array of available languages with level
    languageName: String,
    languageLevel: String
  }],
  regions: [{ // array of available region
    type: String
  }],
  license: { // license true or false, default is false
    type: Boolean,
    default: false
  },
  introduction: { // guide's introduction by self
    type: String
  },
  activation: { // guide active
    type: Boolean,
    default: true
  },
  rating: { // rating for Sorting
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = mongoose.model('guide', guideSchema);
