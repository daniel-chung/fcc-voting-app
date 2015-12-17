'use strict';

var Users = require('../models/user.js');
var Poll = require('../models/poll');

function PollHandler () {

  // Do I need to hide other other information?
  this.getUserMeta = function (req, res) {
    Users.findOne(
      { '_id': req.user._id },
      function (err, user) {
        if (err) throw err;
        else if (user) {
          // Show webpage
          res.json({'_id': user._id, 'maxPolls': user.maxPolls});
        }
        else { // Shouldn't exist
          res.json({});
        }
      });
  };

  this.getUser = function (req, res) {
    console.log('getUser', req.params);
    Poll.findOne(
      { '_id': req.user._id },
      function (err, user) {
        if (err) throw err;
        else if (user) {
          // Show webpage
          res.json(user);
        }
        else {
          res.json({});
        }
      });
  };

  this.getCurrPolls = function (req, res) {
    var currPoll = req.params.pollId;
    var userId   = req.params.id;
    console.log('getcurr polls', req.params);
    Poll.findOne(
      { '_id': userId,
        'polls.id': currPoll
      },
      {
        'polls.$': 1
      },
      function (err, result) {
        console.log('getcurr polls 2', result.polls[0] );

        if (err) throw err;
        res.json(result.polls[0]);
      });
  };

  this.deletePoll = function (req, res) {
    var currPoll = req.params.pollId;
    var userId   = req.user._id;
    console.log('delete params: ', req.params);
    // Update Polls collection
    Poll.findOneAndUpdate(
      { '_id': userId },
      { $pull: {
          'polls': { 'id': currPoll }}},
      function (err, user) {
        console.log('delete executed');
        if (err) { throw err; }
        /*else { // need this part if/when we decide to update delete method
          // Update users collection if delete was successful
          Users.findOneAndUpdate(
            { '_id': userId },
            { $inc: { polls: -1 } },
            { new: true },
            function(err, user) {
              if (err) throw err;
            });*/
        else if (user) {
          res.json(user.polls);
        }
        else {
          res.json([]);
        }
      });
  };

  this.createPoll = function (req, res) {
    var poll_name=req.body.pollName;
    var poll_option_0=req.body.pollOption0;
    var poll_option_1=req.body.pollOption1;
    var userId = req.user._id;

    var optionsArr = [];
    for (var i=0; i<=req.params.optionCount; i++) {
      optionsArr.push({
        id: i,
        name: req.body['pollOption' + String(i)],
        count: 0
      });
    }
    // Create poll
    Poll.findOne({ '_id' :  userId }, function(err, user) {
        if (err)
            throw err;
        if (user) {
          // Update if user exists
          Users.findOneAndUpdate(
            { '_id': userId },
            { $inc: { maxPolls: 1 } },
            { upsert: true, new: true },
            function(err, user) {
              if (err) throw err;
              var numPolls = user.maxPolls;
              Poll.findByIdAndUpdate(
                userId,
                { $push: {
                    "polls": {
                      id: numPolls,
                      name: poll_name,
                      options: optionsArr
                    }}},
                { safe: true, upsert: true, new : true},
                function(err, model) {
                    if(err)
                      throw err;
                    res.redirect('/poll/'+userId+'/made/'+numPolls+'/master');
                }
              );
            })
        } else {
          // Otherwise create a new poll
          var newPoll = new Poll();
          newPoll._id = userId;
          newPoll.polls = [{
            id: 0,
            name: poll_name,
            options: optionsArr
          }];
          newPoll.save(function(err) {
              if (err)
                throw err;
              res.redirect('/poll/'+userId+'/made/0/master');
          });
    }});
  };

  this.submitVote = function (req, res) {
    var currPoll = req.params.pollId;
    var userId   = req.params.userId;
    var re = /option(\d+)/;
    var vote_result = re.exec(req.body.voteResult)[1];

    var incKey = 'polls.$.options.'+vote_result+'.count';
    var incOption = {};
    incOption[incKey] = 1;

    Poll.findOneAndUpdate(
      { '_id' :  userId,
        'polls': {
          '$elemMatch': {
            'id': currPoll,
            'options': {
              '$elemMatch': {
                'id': vote_result
              }}}}},
      { '$inc': incOption },
      { 'upsert': false,
        'new': true },
      function(err, result) {
        // Just for testing new values
        //< this works when we set options 'new' to true
        //console.log(result.polls[currPoll]);
      }
    );
    // Redirect to poll view if logged in; otherwise a submitted page
    if (req.isAuthenticated())
      res.redirect('/poll/'+userId+'/view/'+currPoll);
    else
      res.redirect('/poll/submitted');
  };
};


module.exports = PollHandler;
