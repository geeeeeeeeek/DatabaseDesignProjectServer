"use strict";

/**
 * Created by Zhongyi on 1/1/16.
 */

class UserServiceProvider {
  getUsers(nameList, idList) {
    return {'name': nameList, 'id': idList};
  }

}

module.exports = UserServiceProvider;