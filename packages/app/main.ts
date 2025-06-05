import {
    Auth,
    define,
    History,
    Switch,
    Store
} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { Msg } from "./public/messages";
import { Model, init } from "./public/model";
import update from "./public/update";
import { HeaderElement } from "./public/components/header";
import { LoginView} from "./public/views/login-view";
import { RegisterView } from "./public/views/register-view";
import {HomeViewElement} from "./public/views/home-view";
import {EventsView} from "./public/views/events-view";
import {CreateEventView} from "./public/views/create-event-view";
import { EventDetailView } from "./public/views/event-detail-view";
import {MyEventDetailView} from "./public/views/my-event-detail-view";

define({
    "mu-store": class AppStore
        extends Store.Provider<Model, Msg>
    {
        constructor() {
            super(update, init, "SloBucketList:auth");
        }
    },
    "home-view": HomeViewElement,
    "login-view": LoginView,
    "register-view": RegisterView,
    "events-view": EventsView,
    "create-event-view": CreateEventView,
    "event-detail-view": EventDetailView,
    "my-event-detail-view": MyEventDetailView
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
        path: "/app/login",
        view: () => html`
      <login-view></login-view>
    `
    },
    {
        path: "/app/register",
        view: () => html`
      <register-view></register-view>
    `
    },
    {
        path: "/app/create-event",
        view: () => html`
            <create-event-view
                    api="/api/events"
                    redirect="/app/events"
            ></create-event-view>
    `
    },
    {
        path: "/app/events",
        view: () => html`
      <events-view mode="all"></events-view>
    `
    },
    {
        path: "/app/events/:eventId",
        view: ({ eventId }: { eventId: string }) => html`
            <event-detail-view eventId="${eventId}"></event-detail-view>
          `,
    },
    {
        path: "/app/my-events/:eventId",
        view: ({ eventId }: { eventId: string }) => html`
            <my-event-detail-view eventId="${eventId}"></my-event-detail-view>
          `,
    },
    {
        path: "/app/my-events",
        view: () => html`
      <events-view mode="mine"></events-view>
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