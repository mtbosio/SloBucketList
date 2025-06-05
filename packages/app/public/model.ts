import {Credential, EventItem} from "server/models";

export interface Model {
    event?: EventItem;
    profile?: Credential;

    /** All events in the system */
    allEvents: EventItem[];

    /** Only the events created by the logged-in user */
    myEvents: EventItem[];
}

export const init: Model = {
    allEvents: [],
    myEvents: [],
};