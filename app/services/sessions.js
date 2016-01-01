/**
 * Created by Zhongyi on 1/1/16.
 */
"use strict";

let connection = require('./connection');

class SessionServiceProvider {
  static login(data) {
    if (!SessionServiceProvider.sessionMap) {
      SessionServiceProvider.sessionMap = new Map();
    }

    let querySQL = `SELECT * FROM Users u WHERE u.username='${data.name}';`;
    return new Promise((resolve, reject)=> {
      connection.do(querySQL, (err, rows)=> {
        if (rows && rows[0] && rows[0].password == data.password) {
          let token = Date.now();
          SessionServiceProvider.sessionMap.set(token, rows[0].id);
          resolve({token: token, data: rows[0]});
        } else {
          reject();
        }
      });
    }).then((obj) => {
      let typeDetectFunc = (type, resolve)=> {
        let SQL = `SELECT * FROM ${type} u WHERE u.user_id='${obj.data.user_id}';`;
        connection.do(SQL, (err, rows)=> {
          if (rows && rows[0]) {
            obj.type = type;
            resolve(obj);
          }
        });
      };

      return new Promise((resolve, reject)=> {
        if (!obj) reject();

        typeDetectFunc('Developer', resolve);
        typeDetectFunc('Salesman', resolve);
        typeDetectFunc('Manager', resolve);
        typeDetectFunc('admin', resolve);
      });
    });
  }

  static getUserId(token) {
    return SessionServiceProvider.sessionMap.get(token);
  }
}

module.exports = SessionServiceProvider;