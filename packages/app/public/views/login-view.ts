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
         

        `];


    render() {
        return html`
            <h2>User Login</h2>
            <main id="home">
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
            </main>
            <p
            >Or did you want to
                <a href="register">Sign up as a new user</a>?
            </p>
            
        `;
    }

    // more to come
}

