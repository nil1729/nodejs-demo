// http Server
const server = require('http').createServer();

// Socket IO object and cors for accept request from all origins
const io = require('socket.io')(server, {
	cors: { origin: '*' },
});

// Simple Users Chat Room Wise
let users = []; // {id, room} // room (0, 1)

io.on('connection', (socket) => {
	console.log('New User Connected', socket.id);

	// create new user
	let user = { id: socket.id, room: `Room ${Math.floor(Math.random() * 2)}` };
	users.push(user);

	// join on socket room
	socket.join(user.room);

	// listen on Message
	socket.on('message', (message) => {
		let sender = users.find((it) => it.id === socket.id);
		if (sender) {
			// different Emit Methods

			//to sender client
			socket.emit('server-messages', `socket-emit * ${message}`);

			// all clients
			io.emit('server-messages', `io-emit * ${message}`);

			//except sender all clients
			socket.broadcast.emit('server-messages', `broadcast-emit * ${message}`);

			// specific room users
			socket
				.to(sender.room)
				.emit('server-messages', `to-<room>-emit * from ${sender.id} * ${message}`);
		} else socket.emit('error-messages', `socket-emit * NOT Found`);
	});
});

server.listen(8080, () => console.log('Server Started'));
