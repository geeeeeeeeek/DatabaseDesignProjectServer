"use strict";

let express = require('express');
let router = express.Router();

let UserServiceProvider = require('../services/users');

router.get('/', function (req, res, next) {
  res.send("A boring course project for Database Design.");
});


router.get('/developers', function (req, res, next) {

  UserServiceProvider.getDevelopers().then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

module.exports = router;