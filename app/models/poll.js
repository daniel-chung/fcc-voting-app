// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var pollSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    polls : [{
      id: Number,
      name: String,
      options: [
        {
          id: Number,
          name: String,
          count: Number
        }
      ]
    }]
  });

// create the model for users and expose it to our app
module.exports = mongoose.model('Poll', pollSchema);
