import { User } from "../../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { JwtPayload } from "../../types";
import jwt from "jsonwebtoken";
import "dotenv/config";


export async function signup(req: Request, res: Response) {
    try {
        const { email, password }: { email: string; password: string } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User created successfully!", userId: user._id.toString() });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT secret is not defined!");
        }

        const { email, password }: { email: string; password: string } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const payload: JwtPayload = {
            id: user._id.toString(),
            email: user.email
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });

        return res.status(200).json({ message: "User logged in successfully!", userId: user._id.toString() });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}