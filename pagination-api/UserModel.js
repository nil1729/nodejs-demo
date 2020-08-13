const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	user: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = mongoose.model('User', userSchema);
