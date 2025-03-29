import { model } from "mongoose";
import { UserSchema } from "../models";

export const Users = model('userModel', UserSchema, 'users');