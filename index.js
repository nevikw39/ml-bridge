const { Client } = require('libfb')
const config = require("./config.js");
const client = new Client()
client.login(config.get("user"), config.get("pass")).then(() => {
    client.on('message', message => {
        console.log('Got a message!')
        console.log(message.message)
        client.sendMessage(message.threadId, message.message)
    })
})