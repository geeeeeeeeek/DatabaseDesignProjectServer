"use strict";

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./routes/index');
let users = require('./routes/users');
let projects = require('./routes/projects');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Routers
app.use('/', routes);
app.use('/users', users);
app.use('/projects', projects);

module.exports = app;