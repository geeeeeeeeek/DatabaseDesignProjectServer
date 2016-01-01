/**
 * Created by Zhongyi on 1/1/16.
 */
"use strict";

let connection = require('./connection');

class ProjectServiceProvider {
  static getProjects(nameList, idList, managerList, developerList) {
    let querySQL = `SELECT * FROM Project p`;

    if (idList) {
      querySQL = `SELECT * FROM Project p WHERE p.project_id IN ('${idList}');`;
    } else if (nameList) {
      querySQL = `SELECT * FROM Project p WHERE p.project_name IN ('${nameList}');`;
    } else if (managerList) {
      querySQL = `SELECT * FROM Project p WHERE p.user_id IN ('${managerList}');`;
    } else if (developerList) {
      querySQL = `SELECT * FROM Project p JOIN FK_Project_Developer d WHERE p.project_id=d.project_id and d.user_id IN ('${developerList}');`;
    }

    return new Promise((resolve, reject)=> {
      connection.do(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static createProjects(projects) {
    for (let project of projects) {
      // Create entry in project table
      let querySQL = `INSERT IGNORE INTO Project (project_id,user_id,project_name,project_description) VALUES ('${project.id}','${project.manager}','${project.name}','${project.description}');`;
      connection.do(querySQL);
    }
  }

  static deleteProjects(idList) {
    // Delete entry in FK_Project_Developer table
    let querySQL = `DELETE FROM FK_Project_Developer WHERE project_id IN ('${idList}');`;

    // Delete entry in project table
    querySQL = `DELETE FROM Project WHERE project_id IN ('${idList}');`;
    connection.do(querySQL);
  }

  static getProject(id) {
    let querySQL = `SELECT * FROM Project p WHERE p.project_id='${id}';`;

    return new Promise((resolve, reject)=> {
      connection.do(querySQL, (err, rows)=> {
        resolve(rows);
      });
    });
  }

  static updateProject(id, project) {
    let querySQL = `UPDATE Project SET project_name='${project.name}',user_id='${project.manager}',project_description='${project.description}' WHERE project_id='${id}';`;

    connection.do(querySQL);
  }

  static deleteProject(id) {
    // Delete entry in FK_Project_Developer table
    let querySQL = `DELETE FROM FK_Project_Developer WHERE project_id='${id}';`;

    // Delete entry in project table
    querySQL = `DELETE FROM Project WHERE project_id='${id}';`;
    connection.do(querySQL);
  }
}

module.exports = ProjectServiceProvider;