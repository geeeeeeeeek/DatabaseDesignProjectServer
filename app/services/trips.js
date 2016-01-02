/**
 * Created by Zhongyi on 1/2/16.
 */

"use strict";

let connection = require('./connection');

class TripServiceProvider {
  static createTripRequest(request) {
    let timestamp = require('./utils/time')();

    let querySQL = `INSERT IGNORE INTO TripRequest
    (project_id,user_id,status,submit_time,description,headcount,duration,start_time) VALUES
    ('${request.project_id}','${request.user_id}',2,'${timestamp}','${request.description}','${request.headcount}','${request.duration}','${request.start_time}');`;

    connection.queryWithLog(querySQL);
  }

  static getTripRequests(fromList, projectList, statusList) {
    let querySQL = `SELECT * FROM TripRequest`,
        findByFromSQL = `user_id IN (${fromList})`,
        findByStatusSQL = `status IN (${statusList})`,
        findByProjectSQL = `project_id IN (${projectList})`;

    if (statusList) {
      querySQL = `${querySQL} WHERE ${findByStatusSQL}`;
      if (fromList) {
        querySQL = `${querySQL} AND ${findByFromSQL};`;
      } else if (projectList) {
        querySQL = `${querySQL} AND ${findByProjectSQL};`;
      }
    } else {
      if (fromList) {
        querySQL = `${querySQL} WHERE ${findByFromSQL};`;
      } else if (projectList) {
        querySQL = `${querySQL} WHERE ${findByProjectSQL};`;
      }
    }

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTripRequest(id) {
    let querySQL = `SELECT * FROM TripRequest WHERE request_id=${id}`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });

  }
}

module.exports = TripServiceProvider;