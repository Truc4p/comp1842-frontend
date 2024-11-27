import "./assets/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import i18n from './i18n'; // Import the i18n configuration

createApp(App)
  .use(router)
  .use(i18n) // Use the i18n instance
  .mount("#app");