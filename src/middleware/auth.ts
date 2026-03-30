import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { JwtPayload } from "../types";

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

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies["token"];

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decodedToken === "string") {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decodedToken as JwtPayload;
        next();
    } catch (err) {
        res.status(403).json({ message: "Forbidden" });
    }


}