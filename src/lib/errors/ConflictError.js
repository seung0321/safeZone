class ConflictError extends Error {
  statusCode;
  error;

  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    this.error = "Conflict";
  }
}
export default ConflictError ;
