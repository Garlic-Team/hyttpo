const { execSync } = require('child_process');
const fs = require('fs');

let build = (execSync('npx babel --extensions .ts ./src -d ./dist --minified')).toString();
if (build.includes('Successfully')) {
    let content = (fs.readFileSync('./dist/index.js')).toString();
    content += '\nmodule.exports = exports.default;'

    fs.writeFileSync('./dist/index.js', content);
    console.log('Done!')
}