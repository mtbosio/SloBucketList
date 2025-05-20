import { Schema, model } from "mongoose";
import { EventItem } from "../models/event-item";

const EventItemScheme = new Schema<EventItem>(
    {
        eventId: { type: String, required: true, trim: true },
        imgSrc: { type: String, required: true, trim: true },
        alt: { type: String, required: true, trim: true },
        href: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true }
    },
    { collection: "events" }
);

const EventItemModel = model<EventItem>(
    "Event",
    EventItemScheme
);

function index(): Promise<EventItem[]> {
        return EventItemModel.find();
}

function get(eventId: String): Promise<EventItem> {
        return EventItemModel.find({ eventId })
            .then((list) => list[0])
            .catch((err) => {
                    throw `${eventId} Not Found`;
            });
}

function create(json: EventItem): Promise<EventItem> {
    const t = new EventItemModel(json);
    return t.save();
}

function update(
    eventId: String,
    eventItem: EventItem
): Promise<EventItem> {
    return EventItemModel.findOneAndUpdate({ userid: eventId }, eventItem, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${eventId} not updated`;
        else return updated as EventItem;
    });
}

function remove(eventId: String): Promise<void> {
    return EventItemModel.findOneAndDelete({ eventId }).then(
        (deleted) => {
            if (!deleted) throw `${eventId} not deleted`;
        }
    );
}

export default { index, get, create, update, remove };