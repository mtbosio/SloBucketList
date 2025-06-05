// src/views/my-event-detail-view.ts
import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { View, Auth, Observer, History } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Model } from "../model";       // your store’s Model interface
import { Msg } from "../messages";

export class MyEventDetailView extends View<Model, Msg> {
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
        // Look up the event either in allEvents or myEvents
        return (
            this.model.allEvents?.find((ev) => ev.eventId === this.eventId) ??
            this.model.myEvents?.find((ev) => ev.eventId === this.eventId)
        );
    }

    private handleDelete() {
        if (!this.eventId) return;
        const userId = this.getUserId();
        if (!userId) {
            console.warn("Cannot determine userId—are you logged in?");
            return;
        }

        // Only allow deletion if current user is the creator
        if (this.event?.creator !== userId) {
            console.warn("You are not the creator of this event.");
            return;
        }

        this.dispatchMessage([
            "event/delete",
            {
                eventId: this.eventId,
                onSuccess: () => {
                    // After deletion, navigate back to /app/my-events
                    History.dispatch(this, "history/navigate", {
                        href: "/app/my-events",
                    });
                },
                onFailure: (err: Error) => console.error("Delete failed", err),
            },
        ]);
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
      button.delete-btn {
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-error);
        color: var(--color-surface);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        width: fit-content;
        transition: background-color 0.2s;
      }
      button.delete-btn:hover {
        background-color: beige;
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

        // Only show delete button if the current user is the creator
        const userId = this.getUserId();
        const isCreator = userId === this.event.creator;

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

        ${isCreator
            ? html`
              <button class="delete-btn" @click=${this.handleDelete}>
                Delete This Event
              </button>
            `
            : html`
              <p style="color: var(--color-muted)">
                Only the creator can delete this event.
              </p>
            `}
      </div>
    `;
    }
}

customElements.define("my-event-detail-view", MyEventDetailView);
