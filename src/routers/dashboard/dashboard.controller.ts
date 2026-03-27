import { type Request, type Response } from "express";

export function getDashboard(req: Request, res: Response) {
    res.send("Welcome, admin!");
}
