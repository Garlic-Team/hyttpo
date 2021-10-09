const hyttpo = require("hyttpo").default;

(async() => {
    let data = await hyttpo.get('https://hyrousek.tk');

    console.log(data.text())
})();
