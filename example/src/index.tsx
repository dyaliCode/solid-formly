/* @refresh reload */
import { render } from "solid-js/web";

import "@picocss/pico/scss/pico.scss";
import "./index.scss";

import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
