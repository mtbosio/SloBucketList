import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';
import { Observer, Auth, Events } from "@calpoly/mustang";
import reset from '../styles/reset.css.ts'

export class HeaderElement extends LitElement {

    static initializeOnce() {
        // No global initialization needed for now
    }

    // Auth observer
    private _authObserver!: Observer<Auth.Model>;

    @state()
    loggedIn = false;

    @state()
    userid?: string;

    connectedCallback() {
        super.connectedCallback();

        this._authObserver = new Observer<Auth.Model>(this, "SloBucketList:auth");

        this._authObserver.observe((auth: Auth.Model) => {
            const { user } = auth;

            if (user && user.authenticated ) {
                this.loggedIn = true;
                this.userid = user.username;
            } else {
                this.loggedIn = false;
                this.userid = undefined;
            }
        });
    }

    static styles = [
        reset.styles,
        css`
            header {
                ul {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    background-color: var(--background-primary);
                }

                li {
                    float: left;
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-normal);
                    font-family: var(--font-family-base), serif;
                }

                li a {
                    display: block;
                    color: var(--text-primary);
                    text-align: center;
                    padding: 14px 16px;
                    text-decoration: none;
                }
                
                li button {
                    display: block;
                    color: var(--text-primary);
                    text-align: center;
                    padding: 14px 16px;
                    text-decoration: none;
                }

                li button:hover {
                    background-color: var(--text-primary-hover);
                    color: white;
                }

                li a:hover {
                    background-color: var(--text-primary-hover);
                    color: white;
                }
            }

            .dark-mode-switch{
                padding: 10px;
                width: 10%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                float: right;
            }

            li p {
                color: var(--text-primary);
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* The slider */
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }
            .sign-out {
                float: right;
            }

            input:checked + .slider {
                background-color: var(--color-primary);
            }

            input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
            }

            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            /* Rounded sliders */
            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                border-radius: 50%;
            }
    `];

    renderSignOutButton() {
        return html`
        <li>
            <a
              @click=${(e: UIEvent) => {
                    Events.relay(e, "auth:message", ["auth/signout"])
                }}
            >
              Sign Out
            </a>
        </li>
        `;

    }

    renderSignInButton() {
        return html`
        <li>
            <a href="/app/login">
              Sign In…
            </a>
        </li>
    `;
    }

    private _onToggle(e: Event) {
        const checked = (e.target as HTMLInputElement).checked;
        document.body.classList.toggle('dark-mode', checked);
    }

    override render() {
        return html`
            
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        ${this.loggedIn ? html`
                        <li><a href="/app/my-events">Your Events</a></li>
                        <li><a href="/app/create-event">Create Event</a></li>
                        ` : null}
       
                        ${this.loggedIn ?
                                this.renderSignOutButton() :
                                this.renderSignInButton()
                        }
                        
                        
                        <li class="sign-out"><a slot="actuator">
                            Hello, ${this.userid || "user"}
                        </a></li>
                        <li class="dark-mode-switch">
                            <p>Dark Mode</p>
                            <label class="switch">
                                <input type="checkbox" @change=${this._onToggle}>
                                <span class="slider"></span>
                            </label>
                        </li>
                    </ul>
                </nav>
            </header>

        `;
    }
}
