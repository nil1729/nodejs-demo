const mongoose = require('mongoose');

module.exports = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log(`MongoDB Connected ${conn.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
