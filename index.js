const fs = require('fs');
const { Client } = require('libfb');
const Line = require('linebot');
const config = require('config');



const messenger = new Client(fs.existsSync('session.json') ? { session: JSON.parse(fs.readFileSync('session.json', "utf8")) } : {});

messenger.login(config.messenger.usr, config.messenger.pwd).then(() => {

    messenger.on('message', async event => {
        console.debug(event);
        let that = this;
        if (this.id != null) {
            if (this.id == event.authorId)
                return;
            else
                this.id = null;
        }
        config.cars.forEach(i => {
            if (event.message.includes(i))
                that.id = event.authorId;
        });
        if (this.id != null)
            return;
        const lid = config.ml[event.threadId];
        if (lid == undefined) return;
        const usr = await messenger.getUserInfo(event.authorId);
        const msg = {
            "type": "flex",
            "altText": "From Messenger",
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                        {
                            "type": "icon",
                            "url": usr.profilePicSmall,
                            "size": "sm"
                        },
                        {
                            "type": "text",
                            "weight": "bold",
                            "color": "#198964",
                            "margin": "xxl",
                            "text": usr.name,
                            "size": "sm"
                        }
                    ]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": event.message,
                            "size": "md"
                        }
                    ]
                }
            }
        };
        line.push(lid, [msg]).catch(err => console.error(err));
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
    let mid = config.lm[event.source.groupId];
    const msg = event.message.text;
    switch (msg.substring(0, msg.indexOf(' '))) {
        case "/eval":
            line.reply(event.replyToken, { type: "text", text: JSON.stringify(eval(msg.substring(msg.indexOf(' ')))) });
            return;
        case "/connect":
            config.ml[msg.substring(msg.indexOf(' ') + 1)] = event.source.groupId;
            config.lm[event.source.groupId] = msg.substring(msg.indexOf(' ') + 1);
            return;
    }
    if (event.message.type != "text" || mid == undefined) return;
    messenger.sendPresenceState(mid);
    line.getUserProfile(event.source.userId).then(p => {
        messenger.sendMessage(mid, `*${p.displayName}*`);
        messenger.sendPresenceState(mid);
        messenger.sendMessage(mid, msg).catch(err => console.error(err));
    });
});

line.listen('/linewebhook', 3000, function () {
});