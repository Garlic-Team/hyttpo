const hyttpo = require("../src/index");

(async() => {
    let data = await hyttpo.request({
        url: 'https://hyrousek.tk',
        method: 'GET'
    });

    console.log(data.text())
})();
