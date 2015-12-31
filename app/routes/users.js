"use strict";

let express = require('express');
let router = express.Router();

let UserServiceProvider = require('../services/user_services');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let userServiceProvider = new UserServiceProvider();
  let result = userServiceProvider.getUsers("names", "ids");
  res.send(result);
});

module.exports = router;
