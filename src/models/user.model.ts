import mongoose from "mongoose";
import { IUser, userSchema } from "../schemas/user.schema";


export const User = mongoose.model<IUser>("User", userSchema);