/**
 * Created by Zhongyi on 1/2/16.
 */

"use strict";

let connection = require('./connection');

class TripServiceProvider {
  static createTripRequest(request) {
    let timestamp = new Date();
    timestamp = `${timestamp.getUTCFullYear()}-${('00' + (timestamp.getUTCMonth() + 1)).slice(-2)}-${('00' + timestamp.getUTCDate()).slice(-2)}`
        + ` ${('00' + timestamp.getUTCHours()).slice(-2)}:${('00' + timestamp.getUTCMinutes()).slice(-2)}:${('00' + timestamp.getUTCSeconds()).slice(-2)}`;

    let querySQL = `INSERT IGNORE INTO TripRequest
    (project_id,user_id,status,submit_time,description,headcount,duration,start_time) VALUES
    ('${request.project_id}','${request.user_id}',2,'${timestamp}','${request.description}','${request.headcount}','${request.duration}','${request.start_time}');`;

    connection.do(querySQL);
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
      connection.do(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTripRequest(id) {
    let querySQL = `SELECT * FROM TripRequest WHERE request_id=${id}`;

    return new Promise((resolve, reject)=> {
      connection.do(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });

  }
}

module.exports = TripServiceProvider;