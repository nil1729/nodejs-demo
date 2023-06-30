const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const messages = [{id: 1, text: 'Welcome!', username: 'Chat Room'}]
const sockets = [];

app.use(express.json());

app.get('/messages', function(req, res) {
    res.json(messages);
});

app.post('/messages', function(req, res) {
    const message = req.body;
    messages.push(message);

    for (const socket of sockets) {
        socket.send(JSON.stringify(message));
    }
});

app.ws('/messages', function(socket) {
    sockets.push(socket);

    socket.on('close', function() {
        sockets.splice(sockets.indexOf(socket), 1);
    })
});

app.listen(3001, function() {
    console.log('listening on port 3001');
});