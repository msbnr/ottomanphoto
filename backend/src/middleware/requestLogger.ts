import { Request, Response, NextFunction } from 'express';

/**
 * Request Logger Middleware
 * Logs incoming requests and their response times
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  console.log(`➡️  ${req.method} ${req.path}`);

  // Listen for response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const resetColor = '\x1b[0m';

    console.log(
      `⬅️  ${req.method} ${req.path} ${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );

    // Warn about slow requests
    if (duration > 1000) {
      console.warn(`⚠️  Slow request detected: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
};

/**
 * Response Time Header Middleware
 * Adds X-Response-Time header to all responses
 */
export const responseTime = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Store original writeHead
  const originalWriteHead = res.writeHead;

  // Override writeHead to add our header
  res.writeHead = function (this: Response, statusCode: number, ...args: any[]): Response {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalWriteHead.call(this, statusCode, ...args);
  };

  next();
};
