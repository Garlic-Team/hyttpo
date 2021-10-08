const https = require('https');
const http = require('http');
const zlib = require('zlib')
const { responseRefactor } = require('./utils');
const Response = require('./structures/Response');

class Hyttp {
    request(data) {
        if(typeof data !== 'object') throw Error('It must be an object!');
        return this.#rawRequest(data)
    }

    get(data) {
        if(typeof data === 'string') data = { url: data };

        return this.#rawRequest({ method: 'GET', ...data })
    }

    post(data) {
        if(typeof data === 'string') data = { url: data };

        return this.#rawRequest({ method: 'POST', ...data })
    }

    patch(data) {
        if(typeof data === 'string') data = { url: data };

        return this.#rawRequest({ method: 'PATCH', ...data })
    }

    delete(data) {
        if(typeof data === 'string') data = { url: data };

        return this.#rawRequest({ method: 'DELETE', ...data })
    }

    #rawRequest(data) {
        return new Promise((resolve, reject) => {
            let url = new URL(data.url);
            let request = url.protocol === 'https:' ? https : http;
            let method = data.method.toLowerCase();
    
            let body = typeof data.body === 'object' ? JSON.stringify(data.body) : data.body || '{}';

            let headers = data.headers || {};
            if (!headers['Accept']) headers['Accept'] = 'application/json, text/plain, */*';
            if (!headers['User-Agent']) headers['User-Agent'] = 'riso/nodejs'
    
            if(['post', 'patch'].includes(method)) request = request.request;
            else request = request[method];

            let requestOptions = {
                path: `${url.pathname}${url.search}`,
                method: method,
                headers: headers,
                hostname: url.hostname,
                port: url.port
            }

            let req = request(requestOptions, (res) => {
                let lastRequest = req.req || req;
                let stream = res;

                if(res.statusCode !== 204 && lastRequest.method !== 'HEAD') {
                    switch(res.headers['content-encoding']) {
                        case 'gzip':
                        case 'compress':
                        case 'deflate':
                            stream = stream.pipe(zlib.createUnzip())

                            delete res.headers['content-encoding'];
                            break;
                    }
                }

                let response = {
                    request: res,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: res.headers
                }

                if(data.responseType === 'stream') {
                    response.data = stream;
                    resolve(new Response(response));
                } else {
                    let buffer = [];

                    stream.on('data', (chunk) => {
                        buffer.push(chunk);
                    })

                    stream.on('error', (error) => {
                        if (req.aborted) return;
                        reject(error);
                    })

                    stream.on('end', () => {
                        buffer = Buffer.concat(buffer);

                        if (!['arraybuffer', 'buffer'].includes(data.responseType)) {
                            buffer = responseRefactor(buffer);
                        }

                        response.data = buffer;
                        resolve(new Response(response));
                    })
                }
            })

            if(body && method !== 'get') {
                req.write(body);
                req.end();
            }
        })
    }
}

module.exports = Hyttp;
