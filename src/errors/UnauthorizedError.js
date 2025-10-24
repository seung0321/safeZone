class UnauthorizedError extends Error {
  statusCode;
  error;

  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    this.error = "Unauthorized";
  }
}

export { UnauthorizedError };
