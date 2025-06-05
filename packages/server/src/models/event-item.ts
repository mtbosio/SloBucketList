export interface EventItem {
    eventId: string;
    creator: string;
    name: string;
    location: string;
    time: string;
    description: string;
    rsvps: { _id: string; username: string }[];
}