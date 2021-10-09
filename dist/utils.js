"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Util {
  static isJSON(data) {
    if (typeof data !== 'string') return false;

    try {
      const result = JSON.parse(data);
      const type = toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  static responseRefactor(data) {
    let stringedData = data.toString();
    if (Util.isJSON(stringedData)) data = JSON.parse(data);else data = stringedData;
    return data;
  }

}

var _default = Util;
exports.default = _default;
module.exports = exports.default;