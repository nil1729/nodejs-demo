const validator = require('validator');
class checker {
	constructor() {}
	alphabetic(word) {
		if (word && validator.matches(word, /^[A-Za-z\s]+$/)) return true;
		return false;
	}
	numeric(num) {
		if (num && validator.default.isInt(num)) return true;
		return false;
	}
	email(email) {
		if (email && validator.isEmail(email)) return true;
		return false;
	}
	password(password) {
		if (password && validator.isStrongPassword(password)) return true;
		return false;
	}
	siteURL(url) {
		if (url && validator.isURL(url)) return true;
		return false;
	}
	phoneNumber(phoneNumber) {
		return validator.isMobilePhone(phoneNumber, 'en-IN');
	}
	uuid(str) {
		return validator.default.isUUID(str);
	}
	checkDate(...args) {
		let dateToBeCheck = new Date(`${args[0]} 00:00`);
		let paramForDate = args[1];
		let relDate = args[2];
		if (!dateToBeCheck || isNaN(dateToBeCheck)) return false;

		if (paramForDate) {
			switch (paramForDate) {
				case 'smaller':
					if (dateToBeCheck <= new Date(relDate)) return true;
					else return false;
				case 'greater':
					if (dateToBeCheck > new Date(relDate)) return true;
					else return false;
				default:
					return false;
			}
		}
	}
}

module.exports = new checker();
