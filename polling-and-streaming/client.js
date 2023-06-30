const helpers = require('./helpers');
const messagingApi = require('./messaging_api');
const readline = require('readline');

const displayedMessages = [];

const terminal = readline.createInterface({
    input: process.stdin
});

terminal.on('line', function (text) {
    const username = process.env.NAME;
    const id = helpers.getRandomInt(10000);
    const message = {
        id: id,
        text: text,
        username: username
    }
    
    displayedMessages[id] = true;
    messagingApi.sendMessage(message);
});


function displayMessage(message) {
    console.log(`> ${message.username}: ${message.text}`);
    displayedMessages[message.id] = true;
}

async function getAndDisplayMessage() {
    const messages = await messagingApi.getMessages();

    for (const message of messages) {
        const messageAlreadyDisplayed = message.id in displayedMessages;
        if (!messageAlreadyDisplayed) displayMessage(message);
    }
}

function pollMessages() {
    setInterval(getAndDisplayMessage, 3000);
}

function streamMessages() {
    const messagingSocket = messagingApi.createSocketConnection();

    messagingSocket.on('message', function(data) {
        const message = JSON.parse(data);
        const messageAlreadyDisplayed = message.id in displayedMessages;
        if (!messageAlreadyDisplayed) displayMessage(message);
    })
}

if (process.env.MODE === 'poll') {
    getAndDisplayMessage();
    pollMessages();
} else if (process.env.MODE == 'stream') {
    getAndDisplayMessage();
    streamMessages();
}