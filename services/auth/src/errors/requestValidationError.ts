import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super('Invalid request parameters (RequestValidationError)');

		// When extending a built-in class we must add the following line
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		return this.errors.map((err) => {
			if (err.type === 'field') {
				return { message: err.msg, field: err.path };
			}

			return { message: err.msg };
		});
	}
}
