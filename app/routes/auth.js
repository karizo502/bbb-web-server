var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var config = require('../../config/config');
var jwt = require('jsonwebtoken');

// Create API group routes
var apiRoutes = express.Router();


apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          console.log(user)
          var token = jwt.sign({
          _id: user.get('_id'),
          name: user.get('name'),
          image_path: user.get('image_path')
        }, config.secret, {
            expiresIn: 10080 // in seconds
          });
          res.status(200).json({ success: true, token: 'JWT ' + token });
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});


module.exports = apiRoutes;