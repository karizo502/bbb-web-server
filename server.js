// Include our packages in our main server file
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/config');
var User = require('./app/models/user');
var Event = require('./app/models/event');
var jwt = require('jsonwebtoken');

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));

// Initialize passport for use
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next();
});

// Home route. We'll end up changing this to our main front end index later.
app.get('/', function(req, res) {
  res.send('Relax. We will put the home page here later.');
});

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// Bring in defined Passport Strategy
require('./config/passport')(passport);

// Create API group routes
var apiRoutes = express.Router();

// Register new users
apiRoutes.post('/register', function(req, res) {
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
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
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
          res.json({ success: true, token: 'JWT ' + token });
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});

// Protect dashboard route with JWT
apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.send('It worked! User id is: ' + req.user._id + '.');
});

// create new event
apiRoutes.post('/createevent', function(req, res) {
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
      res.json({ success: true, message: 'Successfully created new event.' });
    });
  }
});

// get event list
apiRoutes.get('/geteventlist', passport.authenticate('jwt', { session: false }), function(req, res) {
  Event.find({}, null,{sort: {postdate: -1}}, function (err, events) {
        res.json(events);
        console.log(events);
    });
});

//search user
apiRoutes.get('/searchuser', passport.authenticate('jwt', { session: false }), function(req, res) {
  User.find({}, function (err, users) {
        res.json(users);
        console.log(users);
    });
});

// Set url for API group routes
app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');