const fs = require('fs');
const file = "config.json";
let json = JSON.parse(fs.readFileSync(file));

module.exports = {
    get: function (key) {
        return json[key];
    },
    set: function (key, val) {
        json[key] = val;
        fs.writeFileSync(file, JSON.stringify(json));
    }
}