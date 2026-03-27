import mongoose from "mongoose";

import { IPost, postSchema } from "../schemas/post.schema";


export const Post = mongoose.model<IPost>("Post", postSchema);