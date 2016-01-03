/**
 * Created by Zhongyi on 1/2/16.
 */

"use strict";

let connection = require('./connection');

class TripServiceProvider {
  static createTripRequest(request) {
    let timestamp = require('./utils/time')();
    let querySQL = `SELECT * FROM TripRequest WHERE user_id=${request.user_id} AND status=2;`;
    /* Check if the salesman has more than three pending requests. */

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        if (rows && rows.length >= 3) {
          reject("More than three pending requests.");
          return;
        }
        let querySQL = `INSERT IGNORE INTO TripRequest
         (project_id,user_id,status,submit_time,description,headcount,duration,start_time) VALUES
        ('${request.project_id}','${request.user_id}',2,'${timestamp}','${request.description}','${request.headcount}','${request.duration}','${request.start_time}');`;

        connection.queryWithLog(querySQL);
        resolve("OK");
      });
    });
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
    return new Promise((resolve, reject)=> {
      let querySQL = `SELECT * FROM TripRequest WHERE request_id='${id}'`;

      connection.queryWithLog(querySQL, (err, obj)=> {
        if (obj[0] && obj[0].status == 1) {
          querySQL = `SELECT * FROM RejectedRequest WHERE request_id='${id}';`;
          connection.queryWithLog(querySQL, (err, rows)=> {
            console.log(rows);
            obj[0].reject_reason = rows[rows.length - 1].reason;
            resolve(obj[0]);
          });
        } else {
          resolve(obj);
        }
      });
    });

  }

  static updateTripRequest(request) {
    /* Check request data integrity. */
    let querySQL = '';

    return new Promise((resolve, reject)=> {
      let timestamp = require('./utils/time')();

      if (request.type == 'Manager') {
        /* Update trip request status. */
        if (request.status == 0) {
          /* Create new trip. */
          let ts = Date.now().toString().substr(6, 6);
          querySQL = `INSERT IGNORE INTO Trip (trip_id,request_id,status) VALUES('${ts}','${request.id}','0');`;
          connection.queryWithLog(querySQL);
          querySQL = `UPDATE TripRequest SET status='0',trip_id='${ts}' WHERE request_id='${request.id}';`;
          connection.queryWithLog(querySQL);
          resolve(ts);
        } else if (request.status == 1) {
          /* Create new rejection entry. */
          querySQL = `INSERT IGNORE INTO RejectedRequest (request_id,reject_date,reason) VALUES('${request.id}','${timestamp}','${request.reject_reason}');`;
          connection.queryWithLog(querySQL);
          querySQL = `UPDATE TripRequest SET status='1' WHERE request_id='${request.id}';`;
          connection.queryWithLog(querySQL);
          resolve("Wang!");
        } else {
          reject("Request status has to be approved or rejected.");
          return;
        }
      } else if (request.type == 'Salesman') {
        querySQL = `SELECT * FROM RejectedRequest WHERE request_id=${request.id};`;
        /* Check if it has been rejected more than three times. */
        connection.queryWithLog(querySQL, (err, rows)=> {
          if (rows && rows.length > 3) {
            reject("Rejected for more than three times.");
            return;
          }
          querySQL = `SELECT * FROM TripRequest WHERE user_id=${request.user_id} AND status=2;`;
          /* Check if the salesman has more than three pending requests. */
          connection.queryWithLog(querySQL, (err, rows)=> {
            if (rows && rows.length > 3) {
              reject("More than three pending requests.");
              return;
            }
            querySQL = `UPDATE TripRequest SET
                      status='${request.status}',submit_time='${timestamp}',description='${request.description}',
                      headcount='${request.headcount}',duration='${request.duration}',start_time='${request.start_time}'
                      WHERE request_id='${request.id}';`;

            connection.queryWithLog(querySQL);
            resolve("Meow!");
          });
        });
      } else {
        reject("Invalid request type.");
      }
    });
  }

  static getTripRequestHistory(id) {
    return new Promise((resolve, reject)=> {
      let querySQL = `SELECT * FROM RejectedRequest WHERE request_id='${id}'`;

      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTrips(forList, projectList) {
    let querySQL = `SELECT * FROM Trip JOIN TripRequest`;
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
    return new Promise((resolve, reject)=> {
      let querySQL = `SELECT * FROM Trip t WHERE t.trip_id='${id}';`;

      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTripMembers(id) {
    return new Promise((resolve, reject)=> {
      let querySQL = `SELECT * FROM TripMember;`;

      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static getTripMember(trip_id, user_id) {
    let querySQL = `SELECT * FROM TripMember WHERE user_id='${user_id}' AND trip_id='${trip_id}';`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static updateTripMember(member) {
    let querySQL = `UPDATE TripMember SET status='${member.status}' WHERE trip_id='${member.trip_id}' AND user_id='${member.id}';`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static addTripMembers(id, members) {
    let querySQL = `SELECT * FROM TripRequest r JOIN Project p WHERE r.trip_id='${id}' AND r.project_id=p.project_id;`;
    connection.queryWithLog(querySQL, (err0, rows0)=> {
      let projectId = rows0[0].project_id;
      for (let member of members) {
        querySQL = `INSERT IGNORE INTO TripMember (trip_id,user_id,status) VALUES ('${id}','${member.user_id}','0');`;
        connection.queryWithLog(querySQL);

        querySQL = `INSERT IGNORE INTO FK_Project_Developer (user_id,project_id) VALUES ('${member.user_id}','${projectId}');`;
        connection.queryWithLog(querySQL);
      }
    });

  }

  static getTripReports(id, fromList) {
    let querySQL = `SELECT * FROM Report WHERE trip_id='${id}'`;
    if (fromList)  querySQL = `${querySQL} AND user_id IN ('${fromList}');`;
    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static createTripReport(report) {
    let ts = Date.now().toString().substr(6, 6);

    let querySQL = `INSERT IGNORE INTO Report (report_id,trip_id,description,start_time,duration) VALUES
            ('${ts}','${report.trip_id}','${report.description}','${report.start_time}','${report.duration}');`;
    connection.queryWithLog(querySQL);

    querySQL = `UPDATE TripMember SET report_id='${ts}',status='2' WHERE trip_id='${report.trip_id}' AND user_id='${report.user_id}';`;
    connection.queryWithLog(querySQL, (err, rows)=> {

      querySQL = `SELECT * FROM TripMember WHERE trip_id='${report.trip_id}' AND status<>2;`;
      connection.queryWithLog(querySQL, (err2, rows2)=> {
        if (!rows2 || rows2.length == 0) {
          querySQL = `UPDATE Trip SET status='1' WHERE trip_id='${report.trip_id}';`;
          connection.queryWithLog(querySQL);
        }
      });
    });
  }

  static getTripReport(id) {
    let querySQL = `SELECT * FROM Report WHERE report_id='${id}'`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

}
module.exports = TripServiceProvider;