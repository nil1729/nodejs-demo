const http = require('http');
const WebSocketServer = require('websocket').server;
let connection = null;

const httpServer = http.createServer((req, res) => {
	console.log('we have received a request');
});

const websocket = new WebSocketServer({ httpServer });

websocket.on('request', (request) => {
	connection = request.accept(null, request.origin);
	connection.on('resume', () => console.log('Opened!'));
	connection.on('close', () => console.log('Closed!'));
	connection.on('message', (message) => {
		console.log(`Received message ${message.utf8Data}`);
	});
	sendMessageEvery5Seconds();
});

httpServer.listen(8080, () => {
	console.log('My Server is listening on PORT 8080');
});

function sendMessageEvery5Seconds() {
	connection.send(`Server Message ${Math.random()}`);
	setTimeout(sendMessageEvery5Seconds, 5000);
}
