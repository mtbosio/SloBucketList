import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { define } from "@calpoly/mustang";
import { EventFeed } from "../components/event-feed.ts";
import { MyEventsFeed } from "../components/my-events-feed.ts";
import { EventItemElement } from "../components/event-item.ts";
import {property} from "lit/decorators.js";

define({
    "event-feed": EventFeed,
    "my-events-feed": MyEventsFeed,
    "event-item": EventItemElement,
});

export class EventsView extends LitElement {
    static styles = [
        reset.styles,
        css`
      #hero-container {
        div {
          display: flex;
          flex-direction: row;
          .icon {
            height: 2em;
            width: 2em;
            padding-left: 0.5em;
          }
        }
        margin: 10px;
        height: 100%;
        width: 50%;
        align-items: center;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        transition: box-shadow 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-wrap: wrap;
      }
            
      p, h2 {
        color: var(--text-primary);
      }
            p{
                margin: 20px;
            }

      #events-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      event-feed,
      my-events-feed {
        list-style: none;
        width: 100%;
      }

      .icon {
        stroke: var(--text-primary);
        fill: var(--background-primary);
      }
    `,
    ];

    @property({ type: String }) mode: "all" | "mine" = "all";


    override render() {
        return html`
      <section id="events-list">
        <div id="hero-container">
          <div>
            <h2>${this.mode === "mine" ? "My Events" : "All Events"}</h2>
            <svg class="icon">
              <use href="/assets/icons/events_icons.svg#icon-calendar" />
            </svg>
          </div>
          <p>Friday, June 6</p>


            <!-- Dynamically render either <event-feed> or <my-events-feed> -->
            ${this.mode === "mine" ? html`<my-events-feed></my-events-feed>` : html`<event-feed></event-feed>`}
        </div>
      </section>
    `;
    }
}

