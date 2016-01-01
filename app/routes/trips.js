/**
 * Created by Zhongyi on 1/2/16.
 */
"use strict";

let express = require('express');
let router = express.Router();

let TripServiceProvider = require('../services/trips');

router.get('/requests', function (req, res, next) {
  let nameList = req.query.name, idList = req.query.id;

  TripServiceProvider.getUsers(nameList, idList).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

module.exports = router;