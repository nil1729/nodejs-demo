const express = require('express');
const app = express();
const { users, posts } = require('./data');

const paginateResults = model => {
	return (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		let results = {};
		if (page > 1) {
			results.previousPage = {
				page: page - 1,
				limit: limit,
			};
		}
		if (endIndex < model.length) {
			results.nextPage = {
				page: page + 1,
				limit: limit,
			};
		}
		results.results = model.slice(startIndex, endIndex);
		res.paginatedResults = results;
		next();
	};
};

app.get('/users', paginateResults(users), async (req, res) => {
	res.json(res.paginatedResults);
});

app.get('/posts', paginateResults(posts), async (req, res) => {
	res.json(res.paginatedResults);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
