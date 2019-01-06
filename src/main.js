// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import axios from "axios";
import { VueReCaptcha } from 'vue-recaptcha-v3';
 
// For more options see below
Vue.use(VueReCaptcha, { siteKey: '6Lc8NocUAAAAAHvMN69UATA5in5d8PqkaLU1iyQE' });


import Vuex from "vuex";
Vue.use(Vuex);

import storePlugin from "./storePlugin";
Vue.use(storePlugin);

Vue.use(Vuetify);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
