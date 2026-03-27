import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";

// importing middleware
import { logger } from "./middleware/logger";
import { timeLogger } from "./middleware/timeLogger";

// importing routers
import { usersRouter } from "./routers/users/users.router";
import { postsRouter } from "./routers/posts/posts.router";
import { dashboardRouter } from "./routers/dashboard/dashboard.router";

// importing database connection
import { connectDB } from "./db";
import { cookieAuth } from "./middleware/auth";


// initializing express app
const app = express();
const PORT = process.env.PORT || 8000;

// connect to database
connectDB();


// using middleware
app.use(timeLogger);
app.use(logger);
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

app.get("/login", (req: Request, res: Response) => {
    res.cookie("username", "admin");
    res.json({ message: "Login successful" });
});




// using routers
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/dashboard', cookieAuth, dashboardRouter);


// starting server
app.listen(PORT, () => {
    console.clear();
    console.log(`Server is live on port: ${PORT}`);
});