import { type Request, type Response } from "express";
import { Post } from "../../models/post.model";
import { IPost } from "../../schemas/post.schema";


export async function getAllPosts(req: Request, res: Response) {
    const query = req.query.q as string;


    if (query) {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { body: { $regex: query, $options: "i" } },
            ]
        } as any);

        return res.json(posts);
    }

    const posts = await Post.find();

    res.json(posts);
}

export async function getPostById(req: Request, res: Response) {
    const id = req.params.id || "";

    if (typeof id === "string") {
        const post = await Post.find({ id: parseInt(id) });
        return res.json(post);
    }

    return res.json({ message: "Invalid ID" });
}

export function createPost(req: Request, res: Response) {
    const { userId, id, title, body, isPublished } = req.body;

    const newPost = new Post({
        userId,
        id,
        title,
        body,
        isPublished,
    });

    newPost.save();

    return res.json({ message: "Post created successfully" });
}

export async function updatePost(req: Request, res: Response) {
    try {
        const rawId = req.params.id;

        if (typeof rawId !== "string") {
            return res.status(400).json({ message: "ID is not string" })
        }

        const id = Number(rawId);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID is NaN" })
        }
        const { userId, id: newId, title, body, isPublished } = req.body;
        const post = await Post.findOneAndUpdate({ id }, {
            userId,
            id: newId,
            title,
            body,
            isPublished
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.json({ message: "Post updated successfully" })
    } catch (error) {
        return res.json({ message: "Other error" });
    }

}

export async function deletePost(req: Request, res: Response) {
    try {
        const rawId = req.params.id;

        if (typeof rawId !== "string") {
            return res.status(400).json({ message: "ID is not string" })
        }

        const id = Number(rawId);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID is NaN" })
        }

        const post = await Post.findOneAndDelete({ id });

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.json({ message: "Post deleted successfully" })

    } catch (error) {
        return res.json({ message: "Other error" });
    }
}