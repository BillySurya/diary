import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import "tailwindcss/tailwind.css";

const moment = require("moment");
require("moment/locale/id");

Vue.use(require("vue-moment"), {
  moment,
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
