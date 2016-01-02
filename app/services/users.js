"use strict";

/**
 * Created by Zhongyi on 1/1/16.
 */

let connection = require('./connection');

class UserServiceProvider {
  static getUsers(nameList, idList) {
    let querySQL = `SELECT * FROM Users u`,
        findByNamesSQL = `u.username IN ('${nameList}')`,
        findByIdsSQL = `u.user_id IN ('${idList}')`;

    if (nameList && idList) {
      querySQL = querySQL.concat(` WHERE ${findByNamesSQL} and ${findByIdsSQL};`);
    } else if (nameList) {
      querySQL = querySQL.concat(` WHERE ${findByNamesSQL};`);
    } else if (idList) {
      querySQL = querySQL.concat(` WHERE ${findByIdsSQL};`);
    }

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static createUsers(users) {
    for (let user of users) {
      // Create entry in users table
      let querySQL = `INSERT IGNORE INTO Users (user_id,username,password) VALUES ('${user.id}','${user.name}','${user.password}');`;
      connection.queryWithLog(querySQL);

      // Create entry in corresponding role table
      querySQL = `INSERT IGNORE INTO ${user.type} (user_id) VALUES ('${user.id}');`;
      connection.queryWithLog(querySQL);
    }
  }

  static deleteUsers(idList) {
    let querySQL = '';

    // Delete entry in corresponding role table
    querySQL = `DELETE FROM Developer WHERE user_id IN (${idList});`;
    connection.queryWithLog(querySQL);

    querySQL = `DELETE FROM Manager WHERE user_id IN (${idList});`;
    connection.queryWithLog(querySQL);

    querySQL = `DELETE FROM Salesman WHERE user_id IN (${idList});`;
    connection.queryWithLog(querySQL);

    // Delete entry in users table
    querySQL = `DELETE FROM Users WHERE user_id IN (${idList});`;
    connection.queryWithLog(querySQL);
  }

  static getUser(id) {
    let querySQL = `SELECT * FROM Users WHERE user_id='${id}';`;

    return new Promise((resolve, reject)=> {
      connection.queryWithLog(querySQL, (err, rows)=> {
        resolve(rows[0]);
      });
    }).then((obj) => {
      let typeDetectFunc = (type, resolve)=> {
        let SQL = `SELECT * FROM ${type} u WHERE u.user_id='${obj.user_id}';`;
        connection.queryWithLog(SQL, (err, rows)=> {
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

  static updateUser(id, user) {
    let querySQL = `UPDATE Users SET username='${user.name}',password='${user.password}' WHERE user_id='${id}';`;

    connection.queryWithLog(querySQL);
  }

  static deleteUser(id) {
    let querySQL = '';

    // Delete entry in corresponding role table
    querySQL = `DELETE FROM Developer WHERE user_id='${id}';`;
    connection.queryWithLog(querySQL);

    querySQL = `DELETE FROM Manager WHERE user_id='${id}';`;
    connection.queryWithLog(querySQL);

    querySQL = `DELETE FROM Salesman WHERE user_id='${id}';`;
    connection.queryWithLog(querySQL);

    // Delete entry in users table
    querySQL = `DELETE FROM Users WHERE user_id='${id}';`;
    connection.queryWithLog(querySQL);
  }
}

module.exports = UserServiceProvider;