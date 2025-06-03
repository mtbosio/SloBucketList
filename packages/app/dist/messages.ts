import { EventItem } from "server/models";

export type Msg =
     [
        "event/create",
        {
            event: EventItem;
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]
    | ["event/select", { userid: string }];