import { PayloadRequest } from './constants';

const ignoreHeaders = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];

class Util {
    static isJSON(data): boolean {
        if (typeof data !== 'string') return false;
        try {
            const result = JSON.parse(data);
            const type = toString.call(result);

            return type === '[object Object]' || type === '[object Array]';
        } catch (err) {
            return false;
        }
    }

    static isObject(data): boolean {
        return data !== null && typeof data === 'object';
    }

    static isFunction(data): boolean {
        return toString.call(data) === '[object Function]';
    }

    static isStream(data): boolean {
        return Util.isObject(data) && Util.isFunction(data.data);
    }

    static isFormData(data): boolean {
        return (typeof FormData !== 'undefined') && (data instanceof FormData);
    }

    static stringTrim(data): string {
        return data.trim ? data.trim() : data.replace(/^\s+|\s+$/g, '');
    }

    static toString(data): string {
        return Util.isObject(data) ? JSON.stringify(data) : data.toString();
    }

    static toArrayBuffer(buf) {
        const ab = new ArrayBuffer(buf.length);
        const view = new Uint8Array(ab);

        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }

        return ab;
    }

    static parseHeaders(headers): object {
        let parsed = {};
        let key;
        let val;
        let i;
      
        if (!headers) { return parsed; }
      
        headers.split('\n').forEach((line) => {
          i = line.indexOf(':');
          key = Util.stringTrim(line.substr(0, i).trim()).toLowerCase();
          val = Util.stringTrim(line.substr(i + 1));
      
          if (key) {
            if (parsed[key] && ignoreHeaders.indexOf(key) >= 0) return;

            if (key === 'set-cookie') parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]); 
            else parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        });
      
        return parsed;
      };

    static responseRefactor(data: Buffer | string, encoding?: BufferEncoding) {
        const stringedData = data.toString(encoding ?? 'utf-8');

        if (Util.isJSON(stringedData)) data = JSON.parse(data as string);
        else data = stringedData;

        return data;
    }

    static dataConfigParse(data: PayloadRequest): PayloadRequest {
        return {
            method: data.method || 'GET',
            url: data.url,
            body: data.body || {},
            headers: data.headers || {},
            responseType: data.responseType || undefined,
            responseEncoding: data.responseEncoding || undefined,
            maxContentLength: data.maxContentLength || undefined,
            trackRedirects: data.trackRedirects || false,
            maxRedirects: data.maxRedirects || 0,
            maxBodyLength: data.maxBodyLength || -1,
            agent: data.agent,
            httpsAgent: data.httpsAgent,
            httpAgent: data.httpAgent,
            onEnd: data.onEnd,
            onData: data.onData,
            onError: data.onError,
            onResponse: data.onResponse,
            onDownloadProgress: data.onDownloadProgress,
            onUploadProgress: data.onUploadProgress,
        };
    }
}

export default Util;
