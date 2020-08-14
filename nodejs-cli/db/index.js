const mongoose = require('mongoose');

module.exports = {
	connectDB: async () => {
		try {
			mongoose.connect(process.env.DB_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: true,
			});
			console.log('MongoDB Connected Successfully');
		} catch (e) {
			console.log('MongoDB Connect Error');
		}
	},
	db: mongoose.connection,
};
