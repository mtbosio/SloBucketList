// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import events from "./routes/events";
import cors from "cors";
import auth, { authenticateUser }  from "./routes/auth";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("SloBucketListCluster"); // use your own db name here

app.use(cors());

app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/events", authenticateUser, events);
app.use("/auth", auth);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});