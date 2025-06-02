import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css.ts";
import {
    define,
} from "@calpoly/mustang";
import {SignupFormElement} from "../auth/signup-form.ts";

define({
    "signup-form": SignupFormElement
});
export class RegisterView extends LitElement {
    static styles = [
        reset.styles,
        css `
         

        `];


    render() {
        return html`
            <h2>User Signup</h2>
            <main class="card">
                <signup-form api="http://localhost:3000/auth/register">
                    <label>
                        <span>Username:</span>
                        <input name="username" autocomplete="off" />
                    </label>
                    <label>
                        <span>Password:</span>
                        <input type="password" name="password" />
                    </label>
                </signup-form>
            </main>
            <p
            >Or did you want to
                <a href="login.html">Log in</a>?
            </p>
        `;
    }

    // more to come
}

