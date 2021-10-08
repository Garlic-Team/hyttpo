const hyttp = require("../src/index");

(async() => {
    let data = await hyttp.get('https://hyrousek.tk');

    console.log(data.text())
})();
