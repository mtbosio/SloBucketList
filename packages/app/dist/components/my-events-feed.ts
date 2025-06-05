import {css, html} from "lit";
import {Auth, Observer, View} from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";
import "../components/event-item";
import reset from "../styles/reset.css.ts";

export class MyEventsFeed extends View<Model, Msg> {
    private _hasDispatchedLoadUser = false;

    private getCreatorId(): string | null {
        const authenticatedUser = this._user as Auth.AuthenticatedUser;

        if (!authenticatedUser?.token) return null;

        try {
            const payloadBase64 = authenticatedUser.token.split(".")[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson) as { userId?: string };

            return payload.userId ?? null;
        } catch {
            return null;
        }
    }

    private _authObserver!: Observer<Auth.Model>;
    private _user?: Auth.User;

    constructor() {
        super("SloBucketList:model");
    }

    static styles = [
        reset.styles,
        css`
            
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
    
            #events-list-list li {
                margin-bottom: 1rem;
            }  `
    ];

    override connectedCallback() {
        super.connectedCallback();

        // 1) Observe the Auth provider. We listen on "SloBucketList:auth"
        this._authObserver = new Observer<Auth.Model>(this, "SloBucketList:auth");
        this._authObserver
            .observe((authModel) => {
                // Whenever Auth publishes a new Auth.Model, we update this._user and re-render
                this._user = authModel.user ?? undefined;
                this.requestUpdate();

                // 2) Grab the userId from the token (if it exists)
                const creatorId = this.getCreatorId();
                if (!creatorId) {
                    // not logged in yet, or token missing
                    return;
                }

                // 3) Only dispatch load-user once per login.
                if (this._hasDispatchedLoadUser) {
                    return;
                }
                this._hasDispatchedLoadUser = true;

                // Now that we know who the creator is, fetch “my events”:
                this.dispatchMessage([
                    "events/load-user",
                    {
                        userId: creatorId,
                        onSuccess: () => console.log("Loaded my events"),
                        onFailure: (err) => console.error(err),
                    },
                ]);
            })
            .catch((err) => {
                console.error("Auth observer error:", err);
            });
    }

    override render() {
        return html`
            <ul id="events-list-list">
        ${this.model.myEvents.length === 0
            ? html`<p>You haven’t created any events yet.</p>`
            : this.model.myEvents.map(
                (ev) => html`
                <li>
                    <event-item
                  .eventId=${ev.eventId}
                  .name=${ev.name}
                  .location=${ev.location}
                  .time=${ev.time}
                  .description=${ev.description}
                  mode="mine"
                ></event-item>
                </li>`
            )}
      </ul>
    `;
    }
}
