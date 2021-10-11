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
    
    static responseRefactor(data) {
        let stringedData = data.toString();

        if(Util.isJSON(stringedData)) data = JSON.parse(data);
        else data = stringedData;

        return data;
    }
}

export default Util;
