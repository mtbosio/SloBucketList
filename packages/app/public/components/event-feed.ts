import './event-item.ts';
import reset from '../styles/reset.css.ts';
import {View} from "@calpoly/mustang";
import {Model} from "../model.ts";
import {Msg} from "../messages.ts";
import {css, html} from "lit";

export class EventFeed extends View<Model, Msg> {

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

    constructor() {
        super("SloBucketList:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "events/load-all",
            {
                onSuccess: () => console.log("Loaded all events"),
                onFailure: (err) => console.error(err),
            },
        ]);
    }

    override render() {
        return html`
            <ul id="events-list-list">
                ${this.model.allEvents.map(
                    (event) => html`
                    <li>
                        <event-item
                            eventId=${event.eventId}
                            name=${event.name}
                            location=${event.location}
                            time=${event.time}
                            description=${event.description}
                        ></event-item>
                    </li>
                `)}
          </ul>`;
    }
}
