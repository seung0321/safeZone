import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import UnauthorizedError from '../errors/UnauthorizedError';
import ForbiddenError from '../errors/ForbiddenError';
import ConflictError from '../errors/ConfictError';
import { StructError } from 'superstruct';

export function globalErrorHandler(err,req, res, next) {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message, statusCode: 400, error: 'BadRequest' });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).send({ message: 'Invalid JSON', statusCode: 400, error: 'BadRequest' });
    return;
  }

  if ('code' in err) {
    console.error(err);
    res.status(500).send({
      message: 'Failed to process data',
      statusCode: 500,
      error: 'PrismaError',
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).send({
      message: err.message,
      statusCode: 404,
      error: 'Not Found',
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).send({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).send({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).send({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
}
