"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var https = _interopRequireWildcard(require("https"));

var http = _interopRequireWildcard(require("http"));

var zlib = _interopRequireWildcard(require("zlib"));

var _utils = _interopRequireDefault(require("./utils"));

var _Response = _interopRequireDefault(require("./structures/Response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'DELETE'];

class Hyttpo {
  constructor() {
    methods.forEach(method => {
      this[method.toLocaleLowerCase()] = data => {
        if (typeof data === 'string') data = {
          url: data
        };
        return this.rawRequest({
          method: method,
          ...data
        });
      };
    });
  }

  request(data) {
    if (typeof data !== 'object') throw Error('It must be an object!');
    return this.rawRequest(data);
  }

  rawRequest(data) {
    return new Promise((resolve, reject) => {
      let url = new URL(data.url);
      let request = url.protocol === 'https:' ? https : http;
      let method = data.method.toUpperCase();
      let body = typeof data.body === 'object' ? JSON.stringify(data.body) : data.body || '{}';
      let headers = data.headers || {};
      if (!headers['Accept']) headers['Accept'] = 'application/json, text/plain, */*';
      if (!headers['User-Agent']) headers['User-Agent'] = 'riso/nodejs';
      if (['POST', 'PATCH'].includes(method)) request = request.request;else request = request[method.toLowerCase()];
      let requestOptions = {
        path: `${url.pathname}${url.search}`,
        method: method,
        headers: headers,
        hostname: url.hostname,
        port: url.port
      };
      let req = request(requestOptions, res => {
        let lastRequest = req.req || req;
        let stream = res;

        if (res.statusCode !== 204 && lastRequest.method !== 'HEAD') {
          switch (res.headers['content-encoding']) {
            case 'gzip':
            case 'compress':
            case 'deflate':
              stream = stream.pipe(zlib.createUnzip());
              delete res.headers['content-encoding'];
              break;
          }
        }

        let response = {
          request: res,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: null
        };

        if (data.responseType === 'stream') {
          response.data = stream;
          let final = new _Response.default(response);
          if (final.ok) resolve(final);else reject(final);
        } else {
          let buffer = [];
          stream.on('data', chunk => {
            buffer.push(chunk);
          });
          stream.on('error', error => {
            if (req.aborted) return;
            reject(error);
          });
          stream.on('end', () => {
            buffer = Buffer.concat(buffer);

            if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
              buffer = _utils.default.responseRefactor(buffer);
            }

            response.data = buffer;
            let final = new _Response.default(response);
            if (final.ok) resolve(final);else reject(final);
          });
        }
      });

      if (body && method !== 'GET') {
        req.write(body);
        req.end();
      }
    });
  }

}

var _default = Hyttpo;
exports.default = _default;
module.exports = exports.default;