var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var guideSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  userName: { // name of userDB
    type: String,
    requried: true
  },
  languages: { // array of available languages with level
    mostConfidentLanguage : String,
    availableLanguage : [{type:String}],
    levelOfLanguage: {type:Number, default:0}
  },
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
  createdDate: { // created Date for guide
    type: String,
    default: Date.now
  },
  wroteFeed: [{ // Feed by guide
    type: Schema.Types.ObjectId,
    ref: 'feed'
  }],
  rating: { // rating (0~5) license = 1 , totalFeed/5(max 2), totalFeedLike/10(max 2)
    star: {
      type: Number,
      default: 0
    },
    totalFeed: {
      type: Number,
      default: 0
    },
    totalFeedLike: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('guide', guideSchema);
