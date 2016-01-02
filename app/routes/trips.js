/**
 * Created by Zhongyi on 1/2/16.
 */
"use strict";

let express = require('express');
let router = express.Router();

let TripServiceProvider = require('../services/trips');

router.get('/requests', function (req, res, next) {
  let fromList = req.query.from, projectList = req.query.project, statusList = req.query.status;

  TripServiceProvider.getTripRequests(fromList, projectList, statusList).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.post('/requests', function (req, res, next) {
  let request = req.body;

  TripServiceProvider.createTripRequest(request);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write({"message": "OK\n"});
  res.end();
});

router.get('/requests/:request_id', function (req, res, next) {
  let id = req.params.request_id;

  TripServiceProvider.getTripRequest(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.put('/requests/:request_id', function (req, res, next) {
  let id = req.params.request_id, request = req.body;

  if (request.id && request.id != id) {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.write('Bad Request: inconsistent trip request id.\n');
    res.end();
  }

  request.id = id;

  TripServiceProvider.updateTripRequest(request).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write({"message": "OK\n"});
    res.end();
  }).catch((err)=> {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.write({"message": `Bad Request: ${err}`});
    res.end();
  });
});

router.get('/requests/:request_id/history', function (req, res, next) {
  let id = req.params.request_id;

  TripServiceProvider.getTripRequestHistory(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.get('/:trip_id', function (req, res, next) {
  let id = req.query.trip_id;

  TripServiceProvider.getTrip(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.get('/:trip_id/members', function (req, res, next) {
  let id = req.query.trip_id;

  TripServiceProvider.getTripMembers(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.post('/:trip_id/members', function (req, res, next) {
  let members = (req.body instanceof Array) ? req.body : [req.body];

  TripServiceProvider.addTripMembers(members).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

module.exports = router;