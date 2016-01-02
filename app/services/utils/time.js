/**
 * Created by Zhongyi on 1/2/16.
 */
"use strict";

module.exports = ()=> {
  let timestamp = new Date();
  timestamp = `${timestamp.getUTCFullYear()}-${('00' + (timestamp.getUTCMonth() + 1)).slice(-2)}-${('00' + timestamp.getUTCDate()).slice(-2)}`
      + ` ${('00' + timestamp.getUTCHours()).slice(-2)}:${('00' + timestamp.getUTCMinutes()).slice(-2)}:${('00' + timestamp.getUTCSeconds()).slice(-2)}`;
  return timestamp;
};