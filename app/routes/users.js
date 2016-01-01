"use strict";

let express = require('express');
let router = express.Router();

let UserServiceProvider = require('../services/user_services');

router.get('/', function (req, res, next) {
  let nameList = req.query.name, idList = req.query.id;

  UserServiceProvider.getUsers(nameList, idList).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.post('/', function (req, res, next) {
  let users = (req.body instanceof Array) ? req.body : [req.body];

  UserServiceProvider.createUsers(users);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});

router.delete('/', function (req, res, next) {
  let idList = (req.query.id instanceof Array) ? req.query.id : [req.query.id];

  UserServiceProvider.deleteUsers(idList);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});

module.exports = router;
