import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import { EventFeed } from "../components/event-feed.ts";
import { EventItemElement } from "../components/event-item.ts";
import { define } from "@calpoly/mustang";

define({
    "event-feed": EventFeed,
    "event-item": EventItemElement,
});

export class HomeViewElement extends LitElement {
    static styles = [
        reset.styles,
        css `
            #home{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #hero{
                height: 30%;
                width: 50%;
                margin: 10px;
                align-items: center;
                background-color: var(--background-primary);
                color: var(--text-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                div{
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    h1{
                        padding: 5px;

                    }
                }
            }

            .icon{
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }

            .hero-container {
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

            p,
            h2 {
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
        `];


    render() {
        return html`
            <section id="home">
                <!-- Hero Section -->
                <section id="hero">
                    <svg class="icon">
                        <use href="/assets/icons/events_icons.svg#icon-bucket"/>
                    </svg>

                    <div><h1>Welcome to the SloBucketList!</h1></div>
                    <div><p>Find, attend, and create local events in San Luis Obispo</p></div>
                </section>

                <div class="hero-container">
                    <div>
                        <h2>All Events</h2>
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-calendar" />
                        </svg>
                    </div>
                    <p>Friday, June 6</p>

                    <event-feed></event-feed>
                </div>
            </section>    
            
        `;
    }

    // more to come
}