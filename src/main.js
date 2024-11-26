import "./assets/index.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

createApp(App).use(router).mount("#app");


const app = Vue.createApp({
    data() {
        return {
            cart: [],
            premium: true
        }
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
  })
  