class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.error = "NotFound";
  }
}

export default NotFoundError;
