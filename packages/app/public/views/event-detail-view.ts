// src/views/event-detail-view.ts
import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { View, Auth, Observer } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Model } from "../model";       // your store’s Model interface
import { Msg } from "../messages";

export class EventDetailView extends View<Model, Msg> {
    @property({ type: String }) eventId?: string;

    private _authObserver!: Observer<Auth.Model>;
    private _user?: Auth.User;

    constructor() {
        super("SloBucketList:model");
    }

    override connectedCallback() {
        super.connectedCallback();
        this._authObserver = new Observer<Auth.Model>(this, "SloBucketList:auth");
        this._authObserver.observe((authModel) => {
            this._user = authModel.user ?? undefined;
            this.requestUpdate();
        });
    }

    private getUserId(): string | null {
        const authUser = this._user as Auth.AuthenticatedUser;
        if (!authUser?.token) return null;
        try {
            const payloadBase64 = authUser.token.split(".")[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson) as { userId?: string };
            return payload.userId ?? null;
        } catch {
            return null;
        }
    }

    private get event() {
        return this.model.allEvents?.find((ev) => ev.eventId === this.eventId);
    }

    private handleToggleRsvp() {
        if (!this.eventId) return;
        const userId = this.getUserId();
        if (!userId) {
            console.warn("Cannot determine userId—are you logged in?");
            return;
        }
        // Check if the user has already RSVPed:
        const already = userId
            ? this.event?.rsvps.some((u) => u._id === userId)
            : false;

        if (already) {
            // Dispatch “un-RSVP”
            this.dispatchMessage([
                "event/unrsvp",
                {
                    eventId: this.eventId,
                    userId,
                    onSuccess: () => console.log("Un-RSVP succeeded"),
                    onFailure: (err: Error) => console.error("Un-RSVP failed", err),
                },
            ]);
        } else {
            // Dispatch “RSVP”
            this.dispatchMessage([
                "event/rsvp",
                {
                    eventId: this.eventId,
                    userId,
                    onSuccess: () => console.log("RSVP succeeded"),
                    onFailure: (err: Error) => console.error("RSVP failed", err),
                },
            ]);
        }
    }

    static styles = [
        reset.styles,
        css`
      .detail-card {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      h2 {
        margin: 0;
        color: var(--text-primary);
      }
      .field-label {
        font-weight: 600;
        color: var(--text-primary);
      }
      .field-value {
        margin: 0.25rem 0 1rem;
        color: var(--text-primary);
      }
      button.rsvp-toggle {
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-primary);
        color: var(--color-surface);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        width: fit-content;
        transition: background-color 0.2s;
      }
      button.rsvp-toggle:hover {
        background-color: var(--color-primary-hover);
      }
      /* Simple styling for the RSVP list */
      .rsvp-list {
        margin-top: 1rem;
        padding-left: var(--space-4);
      }
      .rsvp-list li {
        color: var(--text-primary);
        margin-bottom: var(--space-2);
      }
    `,
    ];

    override render() {
        if (!this.event) {
            return html`
                <p style="text-align: center; color: var(--color-error)">
                    Event not found.
                </p>
            `;
        }

        const userId = this.getUserId();
        const hasRsvped = userId
            ? this.event.rsvps.some((u) => u._id === userId)
            : false;
        const buttonText = hasRsvped ? "Cancel RSVP" : "RSVP to this event";


        return html`
            <div class="detail-card">
                <h2>${this.event.name}</h2>

                <div>
                    <p class="field-label">Location:</p>
                    <p class="field-value">${this.event.location}</p>
                </div>

                <div>
                    <p class="field-label">Time:</p>
                    <p class="field-value">${this.event.time}</p>
                </div>

                <div>
                    <p class="field-label">Description:</p>
                    <p class="field-value">${this.event.description}</p>
                </div>

                <!-- RSVP toggle button -->
                <button class="rsvp-toggle" @click=${this.handleToggleRsvp}>
                    ${buttonText}
                </button>

                <!-- List of user IDs who have RSVPed -->
                <div>
                    <p class="field-label">Currently RSVPed:</p>
                    ${this.event.rsvps.length === 0
                            ? html`<p class="field-value">No one has RSVPed yet.</p>`
                            : html`
                                <ul class="rsvp-list">
                                    ${this.event.rsvps.map(
                                            (u) => html`<li>${u.username}</li>`
                                    )}
                                </ul>
                            `}
                </div>
            </div>
        `;
    }
}

customElements.define("event-detail-view", EventDetailView);
