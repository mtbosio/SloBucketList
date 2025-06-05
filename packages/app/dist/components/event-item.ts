// src/components/event-item.ts
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import reset from '../styles/reset.css.ts';

export class EventItemElement extends LitElement {
    @property({ type: String }) eventId?: string;
    @property({ type: String }) name?: string;
    @property({ type: String }) location?: string;
    @property({ type: String }) time?: string;
    @property({ type: String }) description?: string;
    @property({ type: String }) mode: "all" | "mine" = "all";

    static styles = [
        reset.styles,
        css`
      .event-card {
        display: flex;
        flex-direction: column;
          background-color: var(--background-secondary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        transition: box-shadow 0.2s ease;
        gap: 0.5rem;
      }
      .event-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          
      }

      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
      }

      .event-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        text-decoration: none;
      }

      .event-time,
      .event-location {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-muted);
      }

      .event-description {
        margin: 0;
        font-size: 1rem;
        color: var(--text-primary);
        line-height: var(--line-height-base);
      }
    `,
    ];

    override render() {
        const detailUrl = this.eventId ? this.mode === "all" ? `/app/events/${this.eventId}` : `/app/my-events/${this.eventId}` : '#';

        return html`
            <div class="event-card">
                <div class="event-header">
                    <!-- Click the title to navigate to /events/<eventId> -->
                    <a class="event-title" href="${detailUrl}">
                        ${this.name ?? ''}
                    </a>
                    <div class="event-meta">
                        ${this.time
                                ? html`<p class="event-time">${this.time}</p>`
                                : null}
                        ${this.location
                                ? html`<p class="event-location">${this.location}</p>`
                                : null}
                    </div>
                </div>

                ${this.description
                        ? html`
                            <p class="event-description">
                                ${this.description.length > 115
                                        ? `${this.description.slice(0, 115)}…`
                                        : this.description}
                            </p>
                        `
                        : null}
            </div>
        `;
    }
}

