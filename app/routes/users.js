var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var url = require('url');
// Create API group routes
var apiRoutes = express.Router();

//search user
apiRoutes.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var filterName = parsedUrl.query.name;
  console.log(filterName);
  if(filterName == ''){return res.status(404);}
  var query = {'name':new RegExp(filterName, "i")};
  console.log(query);
  User.find(query, function (err, users) {
        res.status(200).json(users);
        console.log(users);
    });
});

apiRoutes.get('/users/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
  console.log(req.params.id);
  User.find({_id:req.params.id}, function (err, user) {
        res.status(200).json(user);
        console.log(user);
    });
});

// Register new users
apiRoutes.post('/users', function(req, res) {
  if(!req.body.name || !req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter name and email and password.' });
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.status(200).json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

module.exports = apiRoutes;
