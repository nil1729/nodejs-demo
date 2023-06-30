const axios = require('axios');
const WebSocket = require('ws');

function createSocketConnection() {
    return new WebSocket('ws://localhost:3001/messages')
}

function getMessages() {
    return axios.default.get('http://localhost:3001/messages').then(res => res.data)
}

function sendMessage(message) {
    return axios.default.post('http://localhost:3001/messages', message)
}

module.exports = {
    createSocketConnection: createSocketConnection,
    getMessages: getMessages,
    sendMessage: sendMessage
}