import {Schema, model, Types} from "mongoose";
import { EventItem } from "../models/event-item";

const EventItemScheme = new Schema<EventItem>(
    {
        eventId: { type: String, required: true, trim: true },
        creator: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        rsvps: [{ type: Types.ObjectId, ref: "Credential", default: [] }],
    },
    { collection: "events" }
);

const EventItemModel = model<EventItem>(
    "Event",
    EventItemScheme
);

function index(): Promise<EventItem[]> {
    return EventItemModel.find()
        .populate("rsvps", "username")
        .exec()
        .then((docs) => {
            return docs.map((doc) => {
                const o = doc.toObject() as unknown as EventItem;
                o.rsvps = (o.rsvps as any[]).map((user) => ({
                    _id: user._id.toString(),
                    username: (user as any).username,
                }));
                return o;
            });
        });
}

function get(eventId: string): Promise<EventItem> {
    return EventItemModel.findOne({ eventId })
        .populate("rsvps", "username") // only bring in { _id, username }
        .exec()
        .then((doc) => {
            if (!doc) throw `${eventId} Not Found`;
            // Convert mongoose document to plain JS object (with populated rsvps)
            const result = doc.toObject() as unknown as EventItem;
            // Convert each _id to a string if needed:
            result.rsvps = result.rsvps.map((user: any) => ({
                _id: user._id.toString(),
                username: user.username,
            }));
            return result;
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

function findByCreator(creatorId: string): Promise<EventItem[]> {
    // Convert to ObjectId if needed:
    let objId: Types.ObjectId;
    try {
        objId = new Types.ObjectId(creatorId);
    } catch {
        // If `creatorId` isn’t a valid ObjectId, return an empty array:
        return Promise.resolve([]);
    }

    return EventItemModel.find({ creator: objId }).exec();
}

function addRsvp(eventId: string, userId: string): Promise<EventItem> {
    // Convert userId string to ObjectId:
    let objUserId: Types.ObjectId;
    try {
        objUserId = new Types.ObjectId(userId);
    } catch {
        return Promise.reject(new Error("Invalid userId"));
    }

    return EventItemModel.findOneAndUpdate(
        { eventId },
        { $addToSet: { rsvps: objUserId } }, // push only if not already in the array
        { new: true }
    )
        .exec()
        .then((updated) => {
            if (!updated) throw new Error(`Event ${eventId} not found`);
            return updated as EventItem;
        });
}

/**
 * Remove a single userId from the rsvps array.
 * Returns the updated EventItem.
 */
function removeRsvp(eventId: string, userId: string): Promise<EventItem> {
    let objUserId: Types.ObjectId;
    try {
        objUserId = new Types.ObjectId(userId);
    } catch {
        return Promise.reject(new Error("Invalid userId"));
    }

    return EventItemModel.findOneAndUpdate(
        { eventId },
        { $pull: { rsvps: objUserId } },
        { new: true }
    )
        .exec()
        .then((updated) => {
            if (!updated) throw new Error(`Event ${eventId} not found`);
            return updated as EventItem;
        });
}

export default { index, get, create, update, remove, findByCreator, addRsvp,
    removeRsvp, };