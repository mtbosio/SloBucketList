// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
    message: Msg,
    _apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    console.log("Received message");
    switch (message[0]) {
        // … other cases …

        case "event/create": {
            // payload is message[1]
            const { event, onSuccess, onFailure } = message[1];


            // Perform the POST to /api/events.
            // Note: Auth.headers(user) will insert { Authorization: "Bearer <token>" } if logged in.
            fetch(`/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
                body: JSON.stringify(event),
            })
                .then((res) => {
                    if (res.status === 201 || res.status === 200) {
                        return res.json();
                    } else {
                        throw new Error(`Created event failed: ${res.status}`);
                    }
                }).then(() => {
                    if (onSuccess) onSuccess();
                })
      //           .then((jsonCreatedEvent: unknown) => {
      //               // If your model keeps a list of events, you could do:
      //               apply(model => ({
      //                   ...model,
      //                   events: [
      // …model.events,
      //                   (jsonCreatedEvent as EventItem)
      //           ]
      //           }));
      //

      //           })
                .catch((err: Error) => {
                    if (onFailure) onFailure(err);
                });

            break;
        }

        // Optionally handle other message types …

        default: {
            // Ensure exhaustiveness:
            const _ = message[0];
            throw new Error(`Unhandled message type: ${_}`);
        }
    }
}
