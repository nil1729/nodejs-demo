if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const client = require('twilio')(
	process.env.ACCOUNT_SID,
	process.env.AUTH_TOKEN
);
const ejs = require('ejs');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Vew Engine Setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/public'));

// Body Parser Setup
app.use(express.json());

// Index Route
app.get('/', async (req, res) => {
	res.render('index');
});

// Server Setup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

// Post Route
app.post('/', async (req, res) => {
	try {
		const { message, number } = req.body;
		if (message.trim().length === 0 || number.trim().length === 0) {
			throw 'Message or Number is Not Valid';
		}
		const response = await client.messages.create({
			body: `${req.body.message}`,
			from: '+12564729994',
			to: `+91${req.body.number}`,
		});
		if (process.env.NODE_ENV !== 'production') {
			console.log(response);
		}
		res.status(200).json({ msg: 'Message sent successfully' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});
