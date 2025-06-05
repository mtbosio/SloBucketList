import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import {LoginFormElement} from "../auth/login-form.ts";
import {
    define,
} from "@calpoly/mustang";

define({
    "login-form": LoginFormElement
});
export class LoginView extends LitElement {
    static styles = [
        reset.styles,
        css `
            .card{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
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
            label, form, slot, button {
                margin: 5px;
            }
            p,span,h2 {
                color: var(--color-primary);
            }

        `];


    render() {
        return html`
            
            <main class="card">
                <div class="hero-container">
                    <h2>User Login</h2>
                    <login-form api="/auth/login">
                        <label>
                            <span>Username:</span>
                            <input name="username" autocomplete="off" />
                        </label>
                        <label>
                            <span>Password:</span>
                            <input type="password" name="password" />
                        </label>
                    </login-form>
                    <p
                    >Or did you want to
                        <a href="/app/register">Sign up as a new user</a>?
                    </p>
                </div>
            </main>
            
            
        `;
    }

    // more to come
}

