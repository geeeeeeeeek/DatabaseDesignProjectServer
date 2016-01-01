/**
 * Created by Zhongyi on 1/1/16.
 */
"use strict";

let connection = require('./connection');

class SessionServiceProvider {
  static login(data) {
    if (!SessionServiceProvider.sessionMap) {
      console.log(1);
      SessionServiceProvider.sessionMap = new Map();
    }

    let querySQL = `SELECT * FROM Users u WHERE u.username='${data.name}';`;
    return new Promise((resolve, reject)=> {
      connection.do(querySQL, (err, rows)=> {
        console.log(rows);
        if (rows && rows[0] && rows[0].password == data.password) {
          let token = Date.now();
          SessionServiceProvider.sessionMap.set(token, rows[0].id);
          resolve(token);
        } else {
          reject();
        }
      });
    });
  }

  static getUserId(token) {
    return SessionServiceProvider.sessionMap.get(token);
  }
}

module.exports = SessionServiceProvider;