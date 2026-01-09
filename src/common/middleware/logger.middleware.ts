import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logPath = path.join(process.cwd(), "debug_requests.log");
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${
      req.url
    }\nHeaders: ${JSON.stringify(req.headers, null, 2)}\n\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
