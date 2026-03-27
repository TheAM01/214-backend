import { type NextFunction, type Request, type Response } from "express";

export function timeLogger(req: Request, res: Response, next: NextFunction) {
    console.log("Time: ", new Date().toLocaleTimeString());
    next();
}
