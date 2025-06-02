import {
    Auth,
    define,
    History,
    Switch
} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./public/components/header";
import { LoginView} from "./public/views/login-view";
import { RegisterView } from "./public/views/register-view";
import {HomeViewElement} from "./public/views/home-view";
import {EventsView} from "./public/views/events-view";
import {CreateEventView} from "./public/views/create-event-view";

define({
    "home-view": HomeViewElement,
    "login-view": LoginView,
    "register-view": RegisterView,
    "events-view": EventsView,
    "create-event-view": CreateEventView,
})

const routes = [

    {
        path: "/app",
        view: () => html`
      <home-view></home-view>
    `
    },
    {
        path: "/",
        redirect: "/app"
    },
    {
        path: "/login",
        view: () => html`
      <login-view></login-view>
    `
    },
    {
        path: "/register",
        view: () => html`
      <register-view></register-view>
    `
    },
    {
        path: "/create-event",
        view: () => html`
      <create-event-view></create-event-view>
    `
    },
    {
        path: "/events",
        view: () => html`
      <events-view></events-view>
    `
    },
];

define({
    "slo-bucket-list-header": HeaderElement,
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "SloBucketList:history", "SloBucketList:auth");
        }
    },
});