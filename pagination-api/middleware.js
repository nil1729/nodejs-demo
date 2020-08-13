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

const paginateDBResults = model => {
	return async (req, res, next) => {
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
		if (endIndex < (await model.countDocuments().exec())) {
			results.nextPage = {
				page: page + 1,
				limit: limit,
			};
		}
		results.results = await model.find().limit(limit).skip(startIndex).exec();
		res.paginatedResults = results;
		next();
	};
};

module.exports = {
	paginateResults,
	paginateDBResults,
};
