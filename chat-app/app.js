// Express for Initial Rouring
const express = require('express');
const app = express();

// NodeJS HTTP Module
const http = require('http');
const server = http.createServer(app);

// EJS For view Engine
require('ejs');

// Main Socket Object
const io = require('socket.io')(server);

// Bad Words Filters
const Filter = require('bad-words');

// UUID for Initial ID Creations
const { v4: uuidv4 } = require('uuid');
const { addUserInChat, addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

// View Engine Setup
app.set('view engine', 'ejs');

// Serving `public` directory as static files
app.use(express.static(__dirname + '/public'));

// Use URL Encoder For parsing Incoming Requests
app.use(express.urlencoded({ extended: true }));

// Index Page (Form)
app.get('/', (req, res) => {
	res.render('index');
});

// GET /chat Conditional rendering
app.get('/chat', (req, res) => {
	const { username, room } = req.query;
	const id = uuidv4();

	// Create new User
	const { user, error } = addUser({ id, username, room });

	//Checks for error and user
	if (error || !user) res.render('index', { error: error });
	else res.render('chat');
});

// Socket Setup (Initial Connection Listener)
io.on('connection', (socket) => {
	// CUSTOM EVENT `join`
	socket.on('join', ({ username, room }) => {
		// initialize Users with their Socket ID
		const id = socket.id;

		// Add User to the Chat Room
		const { user } = addUserInChat({ id, username, room });

		// All room users (For Showing on Client)
		const roomUsers = getUsersInRoom(user.room);

		// Join the User on Socket Room
		socket.join(user.room);

		// Message for Client Sender
		const message = {
			text: `
                <span class="text-danger" style="text-transform: capitalize;">
                    ${user.username}
                </span>, Welcome to the Chat Room 
                <span class="text-primary" style="text-transform: capitalize;">
                    ${user.room}
                </span>`,
			from: 'admin',
		};

		// Emit Only to that client Sender
		socket.emit('message', message);

		// Message for Other Room Members
		const sentMsg = {
			text: `
                <span class="text-danger" style="text-transform: capitalize;">
                    ${user.username}
                </span> has Joined this Chat Room`,
			from: 'admin',
		};

		// Emit to Other Room Members
		socket.broadcast.to(user.room).emit('message', sentMsg);

		// Send `roomUsers` list to all users of that Room
		io.to(user.room).emit('roomUsers', roomUsers);
	});

	// CUSTOM EVENT `incomingMessage` with a `cb` (Callback function)
	socket.on('incomingMessage', (message, cb) => {
		// Initialization of Bad Words Filter
		const filter = new Filter();

		// Checking for Bad Words (en-US)
		if (filter.isProfane(message)) {
			// Warning Message from Server
			const sentMsg = {
				text: `'${message}' This Line contain a Profane Word`,
				from: 'admin',
			};

			// Return the cb to sender client
			cb(`Message Couldn't be sent`);

			// emit to client sender only
			return socket.emit('serverMessage', sentMsg);
		}

		// Finding USER
		const user = getUser(socket.id);

		// Message Object
		const sentMsg = {
			text: message,
			from: user.username,
		};

		// Emit to Other Room Members
		socket.broadcast.to(user.room).emit('message', sentMsg);
		cb();
	});

	// CUSTOM EVENT `locationMsg` Sharing location
	socket.on('locationMsg', (message, cb) => {
		// get User
		const user = getUser(socket.id);

		// Message Object
		const sentMsg = {
			text: message,
			from: user.username,
		};

		// Emit to Other Room Members as Event `locationMsg`
		socket.broadcast.to(user.room).emit('locationMsg', sentMsg);
		cb();
	});

	// Specially for geoLoaction Error
	socket.on('errorMessage', async (message, cb) => {
		// Message Object
		const sentMsg = {
			text: `'${message}'  You must allow Geolocation for this`,
			from: 'admin',
		};

		// Call Back for Showing Client Side message
		cb();

		// Error Message from Server
		socket.emit('serverMessage', sentMsg);
	});

	socket.on('disconnect', () => {
		// Finding and Remove disconnected user
		const user = removeUser(socket.id);
		if (user) {
			// message object
			const sentMsg = {
				text: `
                    <span class="text-danger" style="text-transform: capitalize;">
                        ${user.username}
                    </span> has left this chat room`,
				from: 'admin',
			};

			// send to all clients
			io.to(user.room).emit('message', sentMsg);

			// All room users (For Showing on Client)
			const roomUsers = getUsersInRoom(user.room);

			// Send `roomUsers` list to all users of that Room
			io.to(user.room).emit('roomUsers', roomUsers);
		}
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, process.env.IP, (req, res) => console.log(`Server Started on PORT ${5000}`));
