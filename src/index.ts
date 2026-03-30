import fs from "fs";
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";

// importing middleware packages
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

// importing middleware
import { logger } from "./middleware/logger";
import { timeLogger } from "./middleware/timeLogger";

// importing routers
import { usersRouter } from "./routers/users/users.router";
import { postsRouter } from "./routers/posts/posts.router";
import { dashboardRouter } from "./routers/dashboard/dashboard.router";
import { authRouter } from "./routers/auth/auth.router";

// importing database connection
import { connectDB } from "./db";
import { cookieAuth, jwtAuth } from "./middleware/auth";


// initializing express app
const app = express();
const PORT = process.env.PORT || 8000;
const stream = fs.createWriteStream("./logs/access.log", { flags: 'a' })

// connect to database
connectDB();


// using middleware
app.use(helmet());
app.use(morgan("combined", { stream }));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// routes
app.get("/", (request: Request, response: Response) => {
    const themePref = request.cookies["theme-preference"];

    if (!themePref) {
        response.cookie("theme-preference", "light", {
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });
    }

    if (themePref === "dark") {
        return response.send("<span style='background-color: black; color: white;'>Hello, World</span>");
    }

    return response.send("<span>Hello, World</span>");
});

app.get("/clear-cookies", (req: Request, res: Response) => {
    res.clearCookie("username");
    res.json({ message: "Cookie cleared" });
});



app.get("/protected", jwtAuth, (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ message: "Protected route", user: req.user });
});


// using routers
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/auth', authRouter);
app.use('/dashboard', cookieAuth, dashboardRouter);


// starting server
app.listen(PORT, () => {
    console.clear();
    console.log(`Server is live on port: ${PORT}`);
});