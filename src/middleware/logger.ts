import { type NextFunction, type Request, type Response } from "express";

// logger middleware function
export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
}