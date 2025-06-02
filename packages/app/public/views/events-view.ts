import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import {
    define
} from "@calpoly/mustang";
import { EventFeed } from "../components/event-feed.ts";
import { EventItemElement } from "../components/event-item.ts";

define({

    "event-feed": EventFeed,
    "event-item": EventItemElement,
});

export class EventsView extends LitElement {
    static styles = [
        reset.styles,
        css `
            #hero-container{
                div{
                    display: flex;
                    flex-direction: row;
                    .icon{
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

            p, h2{
                color: var(--text-primary);
            }

            #events-list {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            event-feed {
                list-style: none;
                width: 50%;
            }

            .icon{
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }

        `];


    render() {
        return html`
            <section id="events-list">
                <div id="hero-container">
                    <div>
                        <h2>Events</h2>
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-calendar"/>
                        </svg>
                    </div>
                    <p>Wednesday, Apr 9</p>
                </div>
                <event-feed src="/api/events"></event-feed>
            </section>
        `;
    }

    // more to come
}

