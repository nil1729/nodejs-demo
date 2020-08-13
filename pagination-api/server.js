const express = require('express');
const app = express();
const users = require('./users');

app.get('/users', async (req, res) => {
	res.json(users);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
