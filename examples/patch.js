const hyttpo = require("hyttpo");

(async() => {
    let data = await hyttpo.patch({
        url: 'https://hyrousek.tk',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hello: 'te' })
    });

    console.log(data)
})();
