import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";

export class HomeViewElement extends LitElement {
    static styles = [
        reset.styles,
        css `
            #home{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            #hero-container{
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #hero{
                height: 30%;
                width: 50%;
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
        

        `];


    render() {
        return html`
            <section id="home">
                <!-- Hero Section -->
                <div id="hero-container">
                    <section id="hero">
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-bucket"/>
                        </svg>

                        <div><h1>Welcome to the SloBucketList!</h1></div>
                        <div><p>Find, attend, and create local events in San Luis Obispo</p></div>
                    </section>
                </div>
            </section>    
            
        `;
    }

    // more to come
}