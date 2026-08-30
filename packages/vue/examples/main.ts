import { createApp } from "vue";
import GardenerVue from "@gardener/vue";
import "../src/style.css";
import App from "./App.vue";

createApp(App).use(GardenerVue).mount("#app");
