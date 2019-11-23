const fs = require('fs');
const file = "config.json";
let json = JSON.parse(fs.readFileSync(file));

module.exports = {
    get: function (key) {
        if (Array.isArray(key))
        {
            let l = json;
            key.forEach(i => l = l[i]);
            return l;
        }
        return json[key];
    },
    set: function (key, val) {
        json[key] = val;
        fs.writeFileSync(file, JSON.stringify(json));
    }
}