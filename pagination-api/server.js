if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const { users, posts } = require('./data');
const connectDB = require('./db');
const User = require('./UserModel');
const { paginateResults, paginateDBResults } = require('./middleware');
connectDB();
app.use(express.json());

app.get('/users', paginateResults(users), async (req, res) => {
	res.json(res.paginatedResults);
});

app.get('/posts', paginateResults(posts), async (req, res) => {
	res.json(res.paginatedResults);
});

app.get('/db-users', paginateDBResults(User), async (req, res) => {
	res.json(res.paginatedResults);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
