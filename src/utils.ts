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

    static responseRefactor(data) {
        let stringedData = data.toString();

        if(Util.isJSON(stringedData)) data = JSON.parse(data);
        else data = stringedData;

        return data;
    }
}

export default Util;
