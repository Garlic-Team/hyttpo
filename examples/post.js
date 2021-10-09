const hyttpo = require("hyttpo");

(async() => {
    let data = await hyttpo.post({
        url: 'https://hyrousek.tk',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hello: 'test' })
    });

    console.log(data)
})();
