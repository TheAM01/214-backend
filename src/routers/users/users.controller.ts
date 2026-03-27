import { type Request, type Response } from "express";
import { users } from "../../data/users";
import { posts } from "../../data/posts";


export function getAllUsers(req: Request, res: Response) {
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
}

export function createUser(req: Request, res: Response) {
    const { body } = req;
    console.log(body)
    const newUser = {
        id: users.length + 1,
        ...body
    };

    users.push(newUser);

    res.status(201).json(newUser);
}

export function getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = users.find(u => u.id === parseInt(id as string));

    res.json({ ...user });
}

export function getPostByUserId(req: Request, res: Response) {
    const { userId, postId } = req.params;

    const post = posts.find(p =>
        p.id === parseInt(postId as string) &&
        p.userId === parseInt(userId as string)
    );

    if (!post) {
        return res.status(404).json({ message: "Post not found for this user" });
    }

    res.json({ ...post });
}