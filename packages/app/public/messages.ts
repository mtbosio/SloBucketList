import { EventItem } from "server/models";

export type Msg =
    // Load all events (no payload needed, except optional callbacks)
    | [
        "events/load-all",
        {
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]

    // Load only this user’s events (needs userId)
    | [
        "events/load-user",
        {
            userId: string;
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]

    // Create a new event
    | [
        "event/create",
        {
            event: EventItem;
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]

    | [
    "event/delete",
        {
            eventId: string;
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]

    | [
        "event/rsvp",
        {
            eventId: string;
            userId: string;
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]

    | [
    "event/unrsvp",
    {
        eventId: string;
        userId: string;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
    }
];