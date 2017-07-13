// Include our packages in our main server file
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/config');

var authRoute = require('./app/routes/auth');
var usersRoute = require('./app/routes/users');
var eventsRoute = require('./app/routes/events');
//import auth from './app/routes/auth';
//import eventsRoute from './app/routes/events';

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

// Set url for API group routes
app.use('/api', authRoute);
app.use('/api', usersRoute);
app.use('/api', eventsRoute);

// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');