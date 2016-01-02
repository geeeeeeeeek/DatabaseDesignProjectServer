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

  TripServiceProvider.createTripRequest(request).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"message": "OK\n"}));
    res.end();
  }).catch((err)=> {
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"message": "Bad Request: " + err}));
    res.end();
  });

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
    res.write(JSON.stringify({"message": 'Bad Request: inconsistent trip request id.\n'}));
    res.end();
  }

  request.id = id;

  TripServiceProvider.updateTripRequest(request).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"message": "OK\n", "trip_id": `${result}`}));
    res.end();
  }).catch((err)=> {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({"message": `Bad Request: ${err}`}));
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
  let id = req.params.trip_id;

  TripServiceProvider.getTrip(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.get('/', function (req, res, next) {
  let forList = req.query.for, projectList = req.query.project;

  TripServiceProvider.getTrips(forList, projectList).then((result)=> {
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
  let id = req.params.trip_id;

  TripServiceProvider.addTripMembers(id, members);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({"message": "OK\n"}));
  res.end();
});

router.get('/:trip_id/members/:user_id', function (req, res, next) {
  let user_id = req.params.user_id, trip_id = req.params.trip_id;

  TripServiceProvider.getTripMember(trip_id, user_id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.put('/:trip_id/members/:user_id', function (req, res, next) {
  let member = req.body;

  member.id = req.params.user_id;
  member.trip_id = req.params.trip_id;

  TripServiceProvider.updateTripMember(member).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.get('/:trip_id/reports', function (req, res, next) {
  let id = req.params.trip_id, fromList = req.query.from;

  TripServiceProvider.getTripReports(id, fromList).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.post('/:trip_id/reports', function (req, res, next) {
  let report = req.body;

  report.trip_id = req.params.trip_id;

  TripServiceProvider.createTripReport(report);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({"message": "OK\n"}));
  res.end();
});

router.get('/:trip_id/reports/:report_id', function (req, res, next) {
  let id = req.params.report_id;

  TripServiceProvider.getTripReport(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

module.exports = router;