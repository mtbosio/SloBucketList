// src/views/CreateEventView.ts
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form, View, History } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Msg } from "../messages";
import {Model} from "../model.ts";
import {EventItem} from "server/models";

// 1) Tell Mustang which custom tags we’ll use:
export class CreateEventView extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element
    });

    /** Where to POST when the form is submitted */
    @property() api = "/api/events";

    /** Where to navigate on success */
    @property() redirect = "/events";

    /** Holds the seven fields exactly matching your mongoose schema */
    @state() formData: {
        eventId?: string;
        imgSrc?: string;
        alt?: string;
        href?: string;
        name?: string;
        location?: string;
        time?: string;
    } = {};

    /** If something goes wrong, show it here */
    @state() error?: string;

    constructor() {
        super("SloBucketList:model");
    }

    static styles = [
        reset.styles,
        css`
      /* (Reuse the same CSS you already had) */
      #event-form {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #hero {
        width: 400px;
        padding: 1rem 1.5rem;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      h2 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }
      label {
        font-weight: 600;
        color: var(--text-primary);
      }
      input[type="text"] {
        padding: 0.5rem;
        font-size: var(--font-size-base);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        outline: none;
      }
      input[type="text"]:focus {
        border-color: var(--color-primary);
      }
      button[type="submit"] {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      button[type="submit"]:disabled {
        background-color: var(--color-muted);
        cursor: not-allowed;
      }
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
      }
    `
    ];

    override render() {
        // 2) Wrap your form inputs in <mu-form>.  Use .init=${…} to pass in initial values.
        //    The <mu-form> will collect them into its “submit” event.
        return html`
            <section id="event-form">
                <div id="hero">
                    <h2>Submit an Event</h2>
                    <p>Fill in all fields below:</p>

                    <mu-form
                            .init=${this.formData}
                            @mu-form:submit=${(e: Form.SubmitEvent<CreateEventView>) =>
                                    this.handleSubmit(e)}
                    >
                        <label for="eventId">Event ID:</label>
                        <input
                                type="text"
                                id="eventId"
                                name="eventId"
                                .value=${this.formData.eventId ?? ""}
                        />

                        <label for="imgSrc">Image URL (imgSrc):</label>
                        <input
                                type="text"
                                id="imgSrc"
                                name="imgSrc"
                                .value=${this.formData.imgSrc ?? ""}
                        />

                        <label for="alt">Alt Text:</label>
                        <input
                                type="text"
                                id="alt"
                                name="alt"
                                .value=${this.formData.alt ?? ""}
                        />

                        <label for="href">Link (href):</label>
                        <input
                                type="text"
                                id="href"
                                name="href"
                                .value=${this.formData.href ?? ""}
                        />

                        <label for="name">Event Name:</label>
                        <input
                                type="text"
                                id="name"
                                name="name"
                                .value=${this.formData.name ?? ""}
                        />

                        <label for="location">Location:</label>
                        <input
                                type="text"
                                id="location"
                                name="location"
                                .value=${this.formData.location ?? ""}
                        />

                        <label for="time">Time (e.g. “2025-06-10 18:00”):</label>
                        <input
                                type="text"
                                id="time"
                                name="time"
                                .value=${this.formData.time ?? ""}
                        />

                        <button
                                type="submit"
                                ?disabled=${!this.canSubmit}
                        >
                            Submit Event
                        </button>
                        <p class="error">${this.error ?? ""}</p>
                    </mu-form>
                </div>
            </section>
        `;
    }

    private get canSubmit(): boolean {
        const { eventId, imgSrc, alt, href, name, location, time } = this.formData;
        return !!(
            this.api &&
            eventId &&
            imgSrc &&
            alt &&
            href &&
            name &&
            location &&
            time
        );
    }

    /**
     * 3) This handler is called when <mu-form> fires mu-form:submit.
     *    event.detail is guaranteed to be a CreateEventFormData object.
     *    We dispatch a Msg to MVU instead of doing fetch() here.
     */
    private handleSubmit(event: Form.SubmitEvent<CreateEventView>) {
        // event.detail is the object with all seven fields:
        const newEvent: CreateEventView = event.detail;

        // Dispatch an ["event/create", payload] message to update():
        console.log("Dispatching message");
        this.dispatchMessage([
            "event/create",
            {
                event: newEvent as unknown as EventItem,
                onSuccess: () => {
                    // Navigate away after success:
                    History.dispatch(this, "history/navigate", {
                        href: this.redirect
                    });
                },
                onFailure: (err: Error) => {
                    this.error = err.message;
                }
            }
        ]);
    }
}
