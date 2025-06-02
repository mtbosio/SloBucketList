import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";

export class CreateEventView extends LitElement {
    static styles = [
        reset.styles,
        css `
            #event-form{
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            p, h2, label{
                color: var(--text-primary);
            }

            #hero{
                height: 30%;
                padding: 20px;
                margin: 10px;
                align-items: flex-start;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-wrap: none;
            }

            .icon{
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }

        `];


    render() {
        return html`
            <section id="event-form">
                <div id="hero">
                    <h2>Submit an Event</h2>
                    <p>Enter Event Details</p>

                    <form>
                        <label for="fname">First name:</label><br/>
                        <input type="text" id="fname" name="fname"><br/>
                        <label for="lname">Last name:</label><br/>
                        <input type="text" id="lname" name="lname"><br/>
                        <label for="eventName">Event title:</label><br/>
                        <input type="text" id="eventName" name="eventName"><br/>
                        <label for="description">Event description:</label><br/>
                        <input type="text" id="description" name="description"><br/>

                        <input type="submit" value="Submit">
                    </form>
                </div>
            </section>\`
        `;
    }

    // more to come
}

