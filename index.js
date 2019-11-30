const fs = require('fs');
const { Client } = require('libfb');
const Line = require('linebot');
const config = require('config');



const messenger = new Client(fs.existsSync('session.json') ? { session: JSON.parse(fs.readFileSync('session.json', "utf8")) } : {});

messenger.login(config.messenger.usr, config.messenger.pwd).then(() => {

    messenger.on('message', msg => {
        console.debug(msg);
        const lid = config.ml[msg.threadId];
        if (lid == undefined) return;
        line.push(lid, msg.message);
    });

    const session = messenger.getSession();
    fs.writeFileSync("session.json", JSON.stringify(session));

}).catch(err => console.error(err));



const line = Line({
    channelId: config.line.id,
    channelSecret: config.line.secret,
    channelAccessToken: config.line.token
});

line.on('join', event => {
    console.debug(event);
})

line.on('message', event => {
    console.debug(event);
    const mid = config.lm[event.source.groupId];
    if (event.message.type != "text" || mid == undefined) return;
    messenger.sendMessage(mid, event.message.text).catch(err => console.error(err));
});

line.listen('/linewebhook', 3000, function () {
});