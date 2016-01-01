"use strict";

let express = require('express');
let router = express.Router();

let ProjectServiceProvider = require('../services/projects');

router.get('/', function (req, res, next) {
  let nameList = req.query.name, idList = req.query.id,
      managerList = req.query.manager, developerList = req.query.developer;

  ProjectServiceProvider.getProjects(nameList, idList, managerList, developerList).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.post('/', function (req, res, next) {
  let projects = (req.body instanceof Array) ? req.body : [req.body];

  ProjectServiceProvider.createProjects(projects);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});

router.delete('/', function (req, res, next) {
  let idList = (req.query.id instanceof Array) ? req.query.id : [req.query.id];

  ProjectServiceProvider.deleteProjects(idList);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});


router.get('/:project_id', function (req, res, next) {
  let id = req.params.project_id;

  ProjectServiceProvider.getProject(id).then((result)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(result));
    res.end();
  });
});

router.put('/:project_id', function (req, res, next) {
  let project = req.body, id = req.params.project_id;

  ProjectServiceProvider.updateProject(id, project);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});

router.delete('/:project_id', function (req, res, next) {
  let id = req.params.project_id;

  ProjectServiceProvider.deleteProject(id);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write("OK");
  res.end();
});

module.exports = router;
