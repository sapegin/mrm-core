'use strict';

class MrmError extends Error {
	constructor(message) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		Object.defineProperty(this, 'name', {
			value: this.constructor.name,
		});
	}
}

module.exports = MrmError;
