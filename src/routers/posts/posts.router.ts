import express from "express";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "./posts.controller";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post("/", createPost);

router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export { router as postsRouter };