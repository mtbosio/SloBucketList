import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import reset from './styles/reset.css.ts';

export class EventItemElement extends LitElement {

    @property({ attribute: 'img-src' })
    imgSrc?: string;

    /** Alt text for the image */
    @property()
    alt?: string;

    /** Link to the event detail page */
    @property()
    href?: string;

    @property()
    name?: string;

    static styles = [
        reset.styles,
        css`
            p, h2{
                color: var(--text-primary);
            }
            

            div {
                display: flex;
                align-items: center;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
            }

            div:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }

            div img {
                flex: 0 0 20%;
                height: auto;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 1rem;
            }

             div a p {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                text-align: center;
                flex: 1;
                color: var(--text-primary);
                text-decoration: none;
            }
    `];

    override render() {
        return html`
            <div>
                <img src="${this.imgSrc}" alt="${this.alt} width="25%" />
                <a href="${this.href}"><p>${this.name}</p></a>
            </div>
        `;
    }
}
