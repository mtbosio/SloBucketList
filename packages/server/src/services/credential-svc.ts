import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        hashedPassword: {
            type: String,
            required: true
        }
    },
    { collection: "user_credentials" }
);

const credentialModel = model<Credential>(
    "Credential",
    credentialSchema
);

function create(username: string, password: string): Promise<Credential> {
    return credentialModel
        .find({ username })
        .then((found: Credential[]) => {
            if (found.length) throw `Username exists: ${username}`
        })
        .then(() =>
            bcrypt
                .genSalt(10)
                .then((salt: string) => bcrypt.hash(password, salt))
                .then((hashedPassword: string) => {
                    const creds = new credentialModel({
                        username,
                        hashedPassword
                    });
                    return creds.save();
                })
        );
}

function verify(
    username: string,
    password: string
): Promise<{ userId: string; username: string }> {
    return credentialModel.findOne({ username }).then((credsOnFile) => {
        if (!credsOnFile) throw "Invalid username or password";

        return bcrypt.compare(password, credsOnFile.hashedPassword).then((ok) => {
            if (!ok) throw "Invalid username or password";

            return {
                userId: credsOnFile._id.toString(),
                username: credsOnFile.username,
            };
        });
    });
}

export default { create, verify };