var express = require('express');
var passport = require('passport');
var Event = require('../models/event');
// Create API group routes
var apiRoutes = express.Router();

// create new event
apiRoutes.post('/events', function(req, res) {
  if(!req.body.event_name || !req.body.creator) {
    res.json({ success: false, message: 'Please enter event_name and creator.' });
  } else {
    var newEvent = new Event({
      event_name: req.body.event_name,
      creator: req.body.creator,
      detail: req.body.detail,
      postdate: req.body.postdate,
      image_path: req.body.image_path
    });

    // Attempt to save the user
    newEvent.save(function(err) {
      if (err) {
        return res.json({ err:err ,success: false, message: 'That event name already exists.'});
      }
      res.status(200).json({ success: true, message: 'Successfully created new event.' });
    });
  }
});

// get event list
apiRoutes.get('/events', passport.authenticate('jwt', { session: false }), function(req, res) {
  Event.find({}, null,{sort: {postdate: -1}}, function (err, events) {
        res.status(200).json(events);
        console.log(events);
    });
});


module.exports = apiRoutes;