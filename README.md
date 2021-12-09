<div align="center">
   <h1>Hyttpo</h1>
</div>

---

## Installation

Install with [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com) / [pnpm](https://pnpm.js.org/):

```sh
npm install hyttpo
yarn add hyttpo
pnpm add hyttpo
```

## Wiki [here](https://github.com/Garlic-Team/hyttpo/wiki)
```js
const hyttpo = require('hyttpo');

hyttpo.request({
   url: 'https://npmjs.org',
   method: 'GET'
})
   .catch(e => e)
   .then((res) => { console.log(res.data) })
```
