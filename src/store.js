/*
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  user: {
    username: "1",
    password: "2",
    fullname: "3",
    access_token: "4",
    refresh_token: "5",
  },
  mutations: {
    setUser (user) {
      state.user = user
    }
  }
})
*/
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    count: 0,
    customer_status: [
      {
        id: 0,
        text: "Open"
      },
      {
        id: 1,
        text: "Band"
      }
    ],
    role: [
      {
        id: 0,
        text: "admin"
      },
      {
        id: 1,
        text: "Staff"
      },
      {
        id: 2,
        text: "Customer"
      }
    ],
    user: {
      username: "",
      password: "",
      fullname: "",
      access_token: "",
      refresh_token: "",
      role: "",
      phone: "",
      email: "",
      status: ""
    },
    wepAPI: {
      url: "http://localhost:3000/"
    },
    current_customer: -1
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
