var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// Schema defines how the user's data will be stored in MongoDB
var EventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  detail: {
    type: String
  },
  postdate : { 
      type : Date, 
      default: Date.now 
  },
  images: [{
    url: String,
    date: {
        type: Date,
        default: Date.now
        }
    }]
});

module.exports = mongoose.model('Event', EventSchema);