import express from "express";
import { createUser, getAllUsers, getPostByUserId, getUserById } from "./users.controller";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.get("/:userId/posts/:postId", getPostByUserId);

export { router as usersRouter };