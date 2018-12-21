import Vue from "vue";
import Router from "vue-router";

const routerOptions = [
  { path: "/", component: "Home" },
  { path: "/login", component: "Login" },
  { path: "/signup", component: "Signup" },
  { path: "/user", component: "User" },
  { path: "/logout", component: "Logout" }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  };
});

Vue.use(Router);

export default new Router({
  mode: "history",
  routes
});