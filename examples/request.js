const hyttp = require("../src/index");

(async() => {
    let data = await hyttp.request({
        url: 'https://hyrousek.tk',
        method: 'GET'
    });

    console.log(data.text())
})();
