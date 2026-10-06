import type { NextFunction, Request, Response } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const id = crypto.randomUUID();
  res.setHeader('x-request-id', id);
  console.log(`${id} ${req.method} ${req.path}`);
  next();
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'That route does not exist.',
    },
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'The request body is not valid JSON.',
      },
    });
    return;
  }
  console.error(err instanceof Error ? err.message : 'Unknown error');
  res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'Something went wrong. Try again.',
    },
  });
}
