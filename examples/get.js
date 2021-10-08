const hyttpo = require("../src/index");

(async() => {
    let data = await hyttpo.get('https://hyrousek.tk');

    console.log(data.text())
})();
