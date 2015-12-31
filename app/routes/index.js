"use strict";

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send("A boring course project for Database Design.");
});

module.exports = router;