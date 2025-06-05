// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import {EventItem} from "server/models";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    console.log("Received message");
    switch (message[0]) {
        // 1) Load every event in the system
        case "events/load-all": {
            const { onSuccess, onFailure } = message[1];

            fetch(`/api/events`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
            })
                .then((res) => {
                    if (res.status === 200) return res.json();
                    throw new Error(`Failed to load all events: ${res.status}`);
                })
                .then((json: unknown) => {
                    const loaded = json as EventItem[];
                    apply((model) => ({
                        ...model,
                        allEvents: loaded,
                    }));
                    if (onSuccess) onSuccess();
                })
                .catch((err: Error) => {
                    if (onFailure) onFailure(err);
                });

            break;
        }

        // 2) Load only events created by a specific user
        case "events/load-user": {
            const { userId, onSuccess, onFailure } = message[1];

            fetch(`/api/events/creator/${encodeURIComponent(userId)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
            })
                .then((res) => {
                    if (res.status === 200) return res.json();
                    throw new Error(`Failed to load user’s events: ${res.status}`);
                })
                .then((json: unknown) => {
                    const loaded = json as EventItem[];
                    apply((model) => ({
                        ...model,
                        myEvents: loaded,
                    }));
                    if (onSuccess) onSuccess();
                })
                .catch((err: Error) => {
                    if (onFailure) onFailure(err);
                });

            break;
        }

        // 3) Create a new event and append to both arrays (allEvents and maybe myEvents)
        case "event/create": {
            const { event, onSuccess, onFailure } = message[1];

            // Perform the POST to /api/events.
            fetch(`/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
                body: JSON.stringify(event),
            })
            .then((json: unknown) => {
                const created = json as EventItem;
                apply((model) => {
                    const updatedAll = [...model.allEvents, created];
                    let updatedMy = model.myEvents;
                    if (created.creator === (user as any).userId) {
                        updatedMy = [...model.myEvents, created];
                    }
                    return {
                        ...model,
                        allEvents: updatedAll,
                        myEvents: updatedMy,
                    };
                });
                if (onSuccess) onSuccess();
            })
            .catch((err: Error) => {
                if (onFailure) onFailure(err);
            });

            break;
        }

        // inside your switch in src/update.ts
        case "event/delete": {
            const { eventId, onSuccess, onFailure } = message[1];

            fetch(`/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Server returned ${res.status}`);
                    }
                    // No JSON body expected on DELETE, so just return eventId
                    return eventId;
                })
                .then((deletedId) => {
                    apply((model) => {
                        // Filter out the deleted event from allEvents and myEvents
                        const newAll = model.allEvents.filter(
                            (e) => e.eventId !== deletedId
                        );
                        const newMy = model.myEvents.filter(
                            (e) => e.eventId !== deletedId
                        );
                        return { ...model, allEvents: newAll, myEvents: newMy };
                    });
                    onSuccess?.();
                })
                .catch((err: Error) => onFailure?.(err));

            break;
        }


        case "event/rsvp": {
            const { eventId, userId, onSuccess, onFailure } = message[1];

            fetch(`/api/events/${eventId}/rsvp/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...Auth.headers(user) },
            })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                // Discard the raw response—now do a second GET with populate
                return fetch(`/api/events/${eventId}`, {
                    headers: { "Content-Type": "application/json", ...Auth.headers(user) },
                });
            })
            .then((res2) => {
                if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
                return res2.json() as Promise<EventItem>;
            })
            .then((populatedEvent: EventItem) => {
                apply((model) => {
                    const newAll = model.allEvents.map((e) =>
                        e.eventId === populatedEvent.eventId ? populatedEvent : e
                    );
                    const newMy = model.myEvents.map((e) =>
                        e.eventId === populatedEvent.eventId ? populatedEvent : e
                    );
                    return { ...model, allEvents: newAll, myEvents: newMy };
                });
                onSuccess?.();
            })
            .catch((err: Error) => onFailure?.(err));

            break;
        }

        case "event/unrsvp": {
            const { eventId, userId, onSuccess, onFailure } = message[1];

            fetch(`/api/events/${eventId}/rsvp/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", ...Auth.headers(user) },
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    // Discard the raw response—now do a second GET with populate
                    return fetch(`/api/events/${eventId}`, {
                        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
                    });
                })
                .then((res2) => {
                    if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
                    return res2.json() as Promise<EventItem>;
                })
                .then((populatedEvent: EventItem) => {
                    apply((model) => {
                        const newAll = model.allEvents.map((e) =>
                            e.eventId === populatedEvent.eventId ? populatedEvent : e
                        );
                        const newMy = model.myEvents.map((e) =>
                            e.eventId === populatedEvent.eventId ? populatedEvent : e
                        );
                        return { ...model, allEvents: newAll, myEvents: newMy };
                    });
                    onSuccess?.();
                })
                .catch((err: Error) => onFailure?.(err));

            break;
        }

        default: {
            const _ = message[0];
            throw new Error(`Unhandled message type: ${_}`);
        }
    }
}
