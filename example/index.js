const hyttp = require("../src/index");

(async() => {
    let data = await hyttp.get({
        url: 'https://hyrousek.tk',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hello: 'test' })
    });

    console.log(data.array())
})();
