import {Types} from "mongoose";

export interface Credential {
    _id: Types.ObjectId;
    username: string;
    hashedPassword: string;
}