const hyttpo = require("hyttpo").default;

(async() => {
    let data = await hyttpo.get('https://hyrousek.tk');

    console.log(data.text())
})();

// With Agent
const hyttpo = require("hyttpo").default;
const HttpsProxyAgent = require('https-proxy-agent');

(async() => {
    let data = await hyttpo.request({
        url: 'https://hyrousek.tk',
        method: 'GET',
        agent: new HttpsProxyAgent('http://168.63.76.32:3128')
    });

    console.log(data.text())
})();
