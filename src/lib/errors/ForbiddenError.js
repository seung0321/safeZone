class ForbiddenError extends Error {
  statusCode;
  error;

  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
    this.error = "Forbidden";
  }
}

export default ForbiddenError;
