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
    let querySQL = `SELECT * FROM TripRequest WHERE request_id='${id}'`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });

  }

  static updateTripRequest(request) {
    /* Check request data integrity. */
    let querySQL = '';

    return new Promise((resolve, reject)=> {
      if (request.type == 'Manager') {
        /* Update trip request status. */
        if (request.status == 0) {
          /* Create new trip. */
          let ts = Date.now();
          querySQL = `UPDATE TripRequest SET status='0',trip_id='${ts}' WHERE request_id='${request.id}';`;
          connection.queryWithLog(querySQL);
          querySQL = `INSERT IGNORE INTO Trip (trip_id,request_id,status) VALUES('${ts}','${request.id}','0');`;
          connection.queryWithLog(querySQL);
          resolve();
        } else if (request.status == 1) {
          /* Create new rejection entry. */
          querySQL = `UPDATE TripRequest SET status='1' WHERE request_id='${request.id}';`;
          connection.queryWithLog(querySQL);
          querySQL = `INSERT IGNORE INTO RejectedRequest (request_id,reject_date,reason) VALUES('${request.id}','${timestamp}','${request.reject_reason}');`;
          connection.queryWithLog(querySQL);
          resolve();
        } else {
          reject("Request status has to be approved or rejected.");
        }
      } else if (request.type == 'Salesman') {
        querySQL = `SELECT * FROM RejectedRequest WHERE request_id=${request.id};`;
        /* Check if it has been rejected more than three times. */
        connection.queryWithLog(querySQL, (err, rows)=> {
          if (rows && rows.length > 3) reject("Rejected for more than three times.");
          querySQL = `SELECT * FROM TripRequest WHERE user_id=${request.user_id} AND status=2;`;
          /* Check if the salesman has more than three pending requests. */
          connection.queryWithLog(querySQL, (err, rows)=> {
            if (rows && rows.length > 3) reject("More than three pending requests.");
            let timestamp = require('./utils/time')();
            querySQL = `UPDATE TripRequest SET
                      status='${request.status}',submit_time='${timestamp}',description='${request.description}',
                      headcount='${request.headcount}',duration='${request.duration}',start_time='${request.start_time}',status='2'
                      WHERE request_id='${request.id}';`;

            connection.queryWithLog(querySQL);
            resolve(true);
          });
        });
      } else {
        reject();
      }
    });
  }

  static getTripRequestHistory(id) {
    let querySQL = `SELECT * FROM RejectedRequest WHERE request_id='${id}'`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTrips(forList, projectList) {
    let querySQL = '';
    if (forList) {
      querySQL = `SELECT * FROM Trip t JOIN TripRequest r JOIN TripMember m WHERE t.trip_id=m.trip_id AND t.trip_id=r.trip_id AND m.user_id IN ('${forList}');`;
    } else if (projectList) {
      querySQL = `SELECT * FROM Trip t JOIN TripRequest r WHERE t.trip_id=r.trip_id AND r.project_id IN ('${projectList}');`;
    }

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTrip(id) {
    let querySQL = `SELECT * FROM Trip t JOIN TripRequest r WHERE t.trip_id=r.trip_id AND r.project_id='${id}';`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTripMembers(id) {
    let querySQL = `SELECT * FROM TripMember WHERE trip_id='${id}';`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static addTripMembers(members) {
    let querySQL = '';
    for (let member of members) {
      querySQL = `${querySQL}\nINSERT IGNORE INTO TripMember (trip_id,user_id,status) VALUES ('${member.trip_id}','${member.user_id}','0');`;
    }
    connection.queryWithLog(querySQL);
  }

  static getTripReport(id, fromList) {
    let querySQL = `SELECT * FROM Report WHERE trip_id='${id}'`;

    if (fromList) {
      querySQL = `${querySQL} WHERE user_id IN ('${fromList}');`
    }

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static createTripReport(report) {
    let querySQL = `INSERT IGNORE INTO Report (report_id,trip_id,description,start_time) VALUES
            ('${report.id}','${report.trip_id}','${report.description}','${report.start_time}');`;
  }
}
module.exports = TripServiceProvider;