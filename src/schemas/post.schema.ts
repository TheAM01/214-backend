import mongoose from "mongoose";

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
    isPublished?: boolean;
}

export const postSchema = new mongoose.Schema<IPost>({
    userId: { required: true, type: Number },
    id: { required: true, type: Number, unique: true },
    title: { required: true, type: String, minlength: 5, maxlength: 100 },
    body: { required: true, type: String },
    isPublished: { required: false, type: Boolean, default: false }
});
