const hyttpo = require("hyttpo");

(async() => {
    let data = await hyttpo.get('https://hyrousek.tk');

    console.log(data.text())
})();
