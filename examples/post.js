const hyttp = require("../src/index");

(async() => {
    let data = await hyttp.post({
        url: 'https://hyrousek.tk',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hello: 'test' })
    });

    console.log(data)
})();
