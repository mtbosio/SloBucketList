import express, { Request, Response } from "express";
import { EventItem } from "../models/event-item";

import Events from "../services/event-item-svc";
import {EventFeed} from "proto/src/event-feed";

const router = express.Router();

router.get("/", (_, res: Response) => {
    Events.index()
        .then((list: EventItem[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:eventId", (req: Request, res: Response) => {
    const { eventId } = req.params;

    Events.get(eventId)
        .then((eventItem: EventItem) => res.json(eventItem))
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newEvent = req.body;

    Events.create(newEvent)
        .then((event: EventItem) =>
            res.status(201).json(event)
        )
        .catch((err) => res.status(500).send(err));
});

router.put("/:eventId", (req: Request, res: Response) => {
    const { eventId } = req.params;
    const newEvent = req.body;

    Events.update(eventId, newEvent)
        .then((event: EventItem) => res.json(event))
        .catch((err) => res.status(404).end());
});

router.delete("/:eventId", (req: Request, res: Response) => {
    const { eventId } = req.params;

    Events.remove(eventId)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;