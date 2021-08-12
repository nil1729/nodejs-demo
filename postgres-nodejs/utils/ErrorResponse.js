class ErrorResponse extends Error {
	constructor(...args) {
		super(args[0]);
		this.statusCode = args[1];
		this.errors = args[2];
	}
}
module.exports = ErrorResponse;
