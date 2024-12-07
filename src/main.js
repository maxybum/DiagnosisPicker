import Vue from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

import Store from "@/store";

export const eventBus = new Vue({
  store: Store,
  router: router,
  render: (h) => h(App),
});

eventBus.$mount("#app");
