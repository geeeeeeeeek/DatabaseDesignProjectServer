"use strict";

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./routes/index');
let sessions = require('./routes/sessions');
let users = require('./routes/users');
let projects = require('./routes/projects');
let trips = require('./routes/trips');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routers
app.use('/', routes);
app.use('/sessions', sessions);
app.use('/users', users);
app.use('/projects', projects);
app.use('/trips', trips);

module.exports = app;