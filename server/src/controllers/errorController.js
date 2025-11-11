import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import { StructError } from 'superstruct';

export function globalErrorHandler(err, req, res, next) {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).json({ message: err.message, statusCode: 400, error: 'BadRequest' });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON', statusCode: 400, error: 'BadRequest' });
    return;
  }

  if ('code' in err) {
    console.error(err);
    res.status(500).json({
      message: err.message || 'Failed to process data',
      statusCode: 500,
      error: 'PrismaError',
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      message: err.message,
      statusCode: 404,
      error: 'Not Found',
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    statusCode: 500,
    error: 'InternalServerError',
  });
}
