import {Credential, EventItem} from "server/models";

export interface Model {
    event?: EventItem;
    profile?: Credential;
}

export const init: Model = {};