import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form, View, History, Auth, Observer } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Msg } from "../messages";
import { Model } from "../model.ts";
import { v4 as uuidv4 } from "uuid";
import { EventItem } from "server/models";

export class CreateEventView extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element,
    });

    @property() api = "/api/events";
    @property() redirect = "/app/events";

    @state()
    formData: {
        name?: string;
        location?: string;
        time?: string;
        description?: string;
    } = {};

    @state() error?: string;

    private _authObserver!: Observer<Auth.Model>;
    private _user?: Auth.User;

    constructor() {
        super("SloBucketList:model");
    }

    protected firstUpdated(): void {
        const muForm = this.renderRoot.querySelector("mu-form");
        if (!muForm) return;

        queueMicrotask(() => {
            const innerForm = muForm.shadowRoot?.querySelector("form");
            if (innerForm) {
                // override the inline grid with block + !important
                innerForm.style.setProperty("display", "block", "important");
            }
        });
    }

    override connectedCallback() {
        super.connectedCallback();
        this._authObserver = new Observer<Auth.Model>(this, "SloBucketList:auth");
        this._authObserver.observe((authModel) => {
            this._user = authModel.user ?? undefined;
            this.requestUpdate();
        });
    }

    private getCreatorId(): string | null {
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

    static styles = [
        reset.styles,
        css`
            /* Full-screen, centered container */
            #event-form {
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #hero {
                width: 700px;
                padding: 1rem 1.5rem;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            h2 {
                margin: 0;
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
                text-align: center;
            }

            p.subtitle {
                margin: 0;
                font-size: var(--font-size-base);
                color: var(--color-muted);
                text-align: center;
            }

            form {
                display: block;
                flex-direction: column;
                gap: var(--space-4);
            }

            label {
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            

            input[type="text"],
            textarea {
                width: 100%;
                padding: var(--space-2);
                font-size: var(--font-size-base);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-sm);
                outline: none;
                background-color: var(--color-background);
            }

            input[type="text"]:focus,
            textarea:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
            }

            textarea {
                resize: vertical;
                min-height: 4rem;
            }

            .error {
                color: var(--color-error);
                font-size: var(--font-size-sm);
                margin-top: var(--space-1);
            }

            .button-container {
                display: flex;
                justify-content: center;
            }

            button[type="submit"] {
                padding: var(--space-2) var(--space-4);
                font-size: var(--font-size-base);
                background-color: var(--color-primary);
                color: var(--color-surface);
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            button[type="submit"]:hover:not(:disabled) {
                background-color: var(--color-primary-hover);
            }

            button[type="submit"]:disabled {
                background-color: var(--color-muted);
                cursor: not-allowed;
            }
        `,
    ];

    override render() {
        return html`
            <section id="event-form">
                <div id="hero">
                    <h2>Submit an Event</h2>
                    <p>Fill in all fields below:</p>

                    <mu-form cols="1"
                            .init=${this.formData}
                            @mu-form:submit=${(e: Form.SubmitEvent<{
                                name: string;
                                location: string;
                                time: string;
                                description: string;
                            }>) => this.handleSubmit(e)}
                    >
                        <!-- Event Name (required) -->
                        <label for="name">Event Name:</label>
                        <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. Summer BBQ"
                                .value=${this.formData.name ?? ""}
                                required
                        />

                        <!-- Location (required) -->
                        <label for="location">Location:</label>
                        <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="e.g. San Luis Obispo, CA"
                                .value=${this.formData.location ?? ""}
                                required
                        />

                        <!-- Time (required) -->
                        <label for="time">Time (YYYY-MM-DD HH:MM):</label>
                        <input
                                type="text"
                                id="time"
                                name="time"
                                placeholder="2025-06-10 18:00"
                                .value=${this.formData.time ?? ""}
                                required
                        />

                        <!-- Description (required) -->
                        <label for="description">Description:</label>
                        <textarea
                                id="description"
                                name="description"
                                placeholder="Brief event description…"
                                required
                        >${this.formData.description ?? ""}</textarea>

                        <!-- ERROR MESSAGE -->
                        <p class="error">${this.error ?? ""}</p>
                    </mu-form>
                </div>
            </section>
        `;
    }


    private handleSubmit(
        event: Form.SubmitEvent<{
            name: string;
            location: string;
            time: string;
            description: string;
        }>
    ) {
        const { name, location, time, description } = event.detail;

        if (!(
            this.api &&
            name?.trim() &&
            location?.trim() &&
            time?.trim() &&
            description?.trim() &&
            this._user?.authenticated
        )) { return; }

        const creatorId = this.getCreatorId();
        if (!creatorId) {
            this.error = "Unable to determine your user ID. Please log in again.";
            return;
        }

        const newEvent: EventItem = {
            eventId: uuidv4(),
            name,
            location,
            time,
            description,
            creator: creatorId,
            rsvps: [{_id: creatorId, username: this._user.username}]
        };

        console.log("Dispatching event/create:", newEvent);

        this.dispatchMessage([
            "event/create",
            {
                event: newEvent,
                onSuccess: () => {
                    History.dispatch(this, "history/navigate", {
                        href: this.redirect,
                    });
                },
                onFailure: (err: Error) => {
                    this.error = err.message;
                },
            },
        ]);
    }
}

customElements.define("create-event-view", CreateEventView);
