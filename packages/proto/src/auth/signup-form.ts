import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";

interface SignupFormData {
    username?: string;
    password?: string;
}

export class SignupFormElement extends LitElement {

    @state()
    formData: SignupFormData = {};

    @property()
    api?: string;

    @property()
    redirect: string = "/";

    @state()
    error?: string;

    get canSubmit(): boolean {
        return Boolean(this.api && this.formData.username &&
            this.formData.password);
    }

    override render() {
        return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button
            ?disabled=${!this.canSubmit}
            type="submit">
            Signup
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
    }

    static styles = [
        reset.styles,
        css`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 3px;
      }
  `];

    handleChange(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        const name = target?.name;
        const value = target?.value;
        const prevData = this.formData;

        switch (name) {
            case "username":
                this.formData = { ...prevData, username: value };
                break;
            case "password":
                this.formData = { ...prevData, password: value };
                break;
        }
    }

    handleSubmit(submitEvent: SubmitEvent) {
        submitEvent.preventDefault();

        if (this.canSubmit) {
            fetch(
                this?.api || "",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.formData)
                }
            )
                .then((res) => {
                    if (res.status !== 201)
                        throw "Signup failed";
                    else return res.json();
                })
                .then((json: object) => {
                    const { token } = json as { token: string };
                    const customEvent = new CustomEvent(
                        'auth:message', {
                            bubbles: true,
                            composed: true,
                            detail: [
                                'auth/signin',
                                { token, redirect: this.redirect }
                            ]
                        });
                    console.log("dispatching message", customEvent);
                    this.dispatchEvent(customEvent);
                })
                .catch((error: Error) => {
                    console.log(error);
                    this.error = error.toString();
                });
        }
    }
}