const mongoose = require('mongoose');
module.exports = async function () {
	try {
		const conn = await mongoose.connect(process.env.DB_URI, {
			useUnifiedTopology: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useCreateIndex: true,
		});
		console.log(`Server Connected to MongoDB (${conn.connection.host})`);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};
