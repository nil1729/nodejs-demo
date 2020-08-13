const mongoose = require('mongoose');
const User = require('./UserModel');
const { users } = require('./data');
module.exports = async () => {
	try {
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		console.log('Mongo DB connection established successfully');
		if ((await User.countDocuments().exec()) > 0) return;
		await User.insertMany(users);
		console.log('Users Added Successfully');
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
};
