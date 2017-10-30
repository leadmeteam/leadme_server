var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      requried: true
    },
    messageBody: String,
    messageDate: Date,
    status: {
      delivered: {type: Boolean, default:false},
      read: {type: Boolean, default:false}
    }
  }]
});


module.exports = mongoose.model('message', messageSchema);
