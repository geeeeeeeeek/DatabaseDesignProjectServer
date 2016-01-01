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
      console.log(querySQL);
      connection.query(querySQL, (err, rows)=> {
        console.log(querySQL);
        console.log('\n');
        resolve(rows);
      });
    });
  }

  static createUsers(users) {

    for (let user of users) {
      // Create entry in users table
      let querySQL = `INSERT IGNORE INTO Users (user_id,username,password) VALUES ('${user.id}','${user.name}','${user.password}');`;
      console.log(querySQL);
      connection.query(querySQL);

      // Create entry in corresponding role table
      querySQL = `INSERT IGNORE INTO ${user.type} (user_id) VALUES ('${user.id}');`;
      console.log(querySQL);
      connection.query(querySQL);
    }

    console.log('\n');
  }

  static deleteUsers(idList) {
    let querySQL = '';

    // Delete entry in corresponding role table
    querySQL = `DELETE FROM Developer WHERE user_id IN (${idList});`;
    console.log(querySQL);
    connection.query(querySQL);

    querySQL = `DELETE FROM Manager WHERE user_id IN (${idList});`;
    console.log(querySQL);
    connection.query(querySQL);

    querySQL = `DELETE FROM Salesman WHERE user_id IN (${idList});`;
    console.log(querySQL);
    connection.query(querySQL);

    // Delete entry in users table
    querySQL = `DELETE FROM Users WHERE user_id IN (${idList});`;
    console.log(querySQL);
    connection.query(querySQL);

    console.log('\n');
  }
}

module.exports = UserServiceProvider;