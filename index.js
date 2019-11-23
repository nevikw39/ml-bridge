const { Client } = require('libfb');
const Line = require('/usr/local/lib/node_modules/linebot');
const config = require("./config.js");

const messenger = new Client();
messenger.login(config.get(["messenger", "usr"]), config.get(["messenger", "pwd"])).then(() => {
    messenger.on('message', msg => {
        if (msg.threadId != "100003690746495") return;
        console.log(msg);
        messenger.sendMessage(msg.threadId, msg.message);
    })
}).catch(err => console.error(err));

const line = Line({
    channelId: config.get(["line", "id"]),
    channelSecret: config.get(["line", "secret"]),
    channelAccessToken: config.get(["line", "token"])
});
line.on('message', event => {
    console.log(event);
    let msg = event.message.text;
    event.reply(msg);
});
line.listen('/linewebhook', 3000, function () {
});