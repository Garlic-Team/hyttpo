const hyttpo = require("hyttpo").default;

(async() => {
    let data = await hyttpo.delete({
        url: 'https://hyrousek.tk',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hello: 'te' })
    });

    console.log(data)
})();
