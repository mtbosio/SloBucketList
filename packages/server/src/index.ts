// public/index.ts
import express, { Response } from "express";
export type {Credential} from "./models/credential";
export type {EventItem} from "./models/event-item";
import { connect } from "./services/mongo";
import events from "./routes/events";
import cors from "cors";
import auth, { authenticateUser }  from "./routes/auth";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
import fs from "node:fs/promises";
import path from "path";

connect("SloBucketListCluster"); // use your own db name here

app.use(cors());

app.use(express.static(staticDir));
app.use(express.json());

app.use("/app", (res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

app.use("/api/events", authenticateUser, events);
app.use("/auth", auth);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});