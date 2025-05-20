import { LitElement, html, css } from 'lit';
import {  state, property } from 'lit/decorators.js';
import './event-item.ts';
import reset from './styles/reset.css.ts';

interface EventDataElement {
    imgSrc: string;
    alt: string;
    href: string;
    name: string;
}

export class EventFeed extends LitElement {
    @property()
    src?: string;

    @state()
    private events: EventDataElement[] = [];

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
            }
    `];

    connectedCallback() {
        super.connectedCallback();
        if (this.src) this.hydrate(this.src);
    }


    hydrate(src: string) {
        fetch(src)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }
                return res.json();
            })
            .then((json: object) => {
                this.events = json as Array<EventDataElement>;
            })
            .catch((err) => {
                console.error('Error hydrating event feed:', err);
            });
    }

    override render() {
        return html`
      <ul id="events-list-list">
        ${this.events.map(
            (event) => html`
                <li>
                    <event-item
                            img-src=${event.imgSrc}
                            alt=${event.alt}
                            href=${event.href}
                            name=${event.name}
                    ></event-item>
                </li>
            `
        )}
      </ul>
    `;
    }
}
