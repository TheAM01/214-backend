import { type NextFunction, type Request, type Response } from "express";

// auth middleware function
export function auth(req: Request, res: Response, next: NextFunction) {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (apiKey !== "1234567890") {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
}

export function cookieAuth(req: Request, res: Response, next: NextFunction) {
    const username = req.cookies["username"];

    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (username !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
}