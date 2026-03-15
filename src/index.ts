import express, { type Request, type Response } from "express";

const app = express();
const PORT = 8000;

// importing data
import { users } from "./data/users";
import { posts } from "./data/posts";


app.get("/", (request: Request, response: Response) => {
    response.json({ message: "Hello, World!" });
});

app.get("/users", (req: Request, res: Response) => {
    const query = req.query.q as string | undefined;

    if (query) {
        const filteredUsers = users.filter(u => {
            const name = u.name.toLowerCase();
            const username = u.username.toLowerCase();
            const email = u.email.toLowerCase();
            const userQuery = query.toLowerCase();

            return name.includes(userQuery) || username.includes(userQuery) || email.includes(userQuery);
        });

        return res.json(filteredUsers);
    }

    res.json(users);
});

app.get("/users/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const user = users.find(u => u.id === parseInt(id as string));

    res.json({ ...user });
});

app.get("/posts", (req: Request, res: Response) => {
    const query = req.query.q as string | undefined;

    if (query) {
        const filteredPosts = posts.filter(p => {
            const title = p.title.toLowerCase();
            const body = p.body.toLowerCase();
            const postQuery = query.toLowerCase();

            return title.includes(postQuery) || body.includes(postQuery);
        });

        return res.json(filteredPosts);
    }

    res.json(posts);
});

app.get("/posts/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const post = posts.find(p => p.id === parseInt(id as string));

    res.json({ ...post });
});

app.get("/users/:userId/posts/:postId", (req: Request, res: Response) => {
    const { userId, postId } = req.params;

    const post = posts.find(p =>
        p.id === parseInt(postId as string) &&
        p.userId === parseInt(userId as string)
    );

    if (!post) {
        return res.status(404).json({ message: "Post not found for this user" });
    }

    res.json({ ...post });
});

app.listen(PORT, () => {
    console.clear();

    console.log(`Server is live on port: ${PORT}`);
});
