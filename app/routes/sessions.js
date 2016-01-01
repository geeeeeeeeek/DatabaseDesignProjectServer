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
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(result);
    res.end();
  }).catch(()=> {
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.write("Meow! Meow meow! Invader detected!\n");
    res.end();
  });
});

module.exports = router;