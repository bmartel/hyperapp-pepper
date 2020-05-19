import { h, app } from "hyperapp";
import { router as Router } from "hyperapp-page-router";
import { loadIndex, loadShow } from "./actions";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const initialState = {
  page: { data: {}, error: {}, loading: true },
};

// Routes
//
// Maps to actions
// actions must update page: {} to at least set route property to a named value
// ie: page: { current: "index" }
const routes = {
  "/": loadIndex,
  "/:site": loadIndex,
  "/:site/t/:id": loadShow,
};

app({
  init: () => initialState,
  view: ({ router, page }) => <App page={page} router={router} />,
  subscriptions: () => [
    Router({
      routes,
    }),
  ],
  node: document.getElementById("app"),
});

serviceWorker.register();
