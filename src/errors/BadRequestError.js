class BadRequestError extends Error {
  constructor(message) {
    super(message);

    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.error = 'BadRequest';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }
  }
}

export {BadRequestError}