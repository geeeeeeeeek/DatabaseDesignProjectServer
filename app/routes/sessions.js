/**
 * Created by Zhongyi on 1/1/16.
 */
"use strict";

let express = require('express');
let router = express.Router();

let SessionServiceProvider = require('../services/sessions');

router.post('/', function (req, res, next) {
  let data = req.body;

  SessionServiceProvider.login(data).then((result)=> {
    console.log(result);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  }).catch((err)=> {
    console.log(err);
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"message": "Meow! Meow meow! Invader detected!\n"}));
    res.end();
  });
});

module.exports = router;