<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar"></v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{ appTitle }}</router-link>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      appTitle: "Bank App",
      sidebar: false,
      menuItems: this.getMenu(),
      user: this.$myStore.state.user.username,
      messages: []
    };
  },
  methods: {
    getMenu() {
      var self = this;
      var menu = [];

      menu.push({
        title: "Home",
        path:
          "/" +
          self.$myStore.state.user.role,
        icon: "home"
      });
      if (self.$myStore.state.user.username == "") {
        menu.push({
          title: "Sign Up",
          path: "/signup",
          icon: "face"
        });
        menu.push({
          title: "Sign In",
          path: "/Login",
          icon: "lock_open"
        });
      } else {
        menu.push({
          title: self.$myStore.state.user.fullname,
          path: "/user",
          icon: "face"
        });
        menu.push({
          title: "Logout",
          path: "/logout",
          icon: "lock_open"
        });
      }
      return menu;
    },
    status_id2str(id) {
      console.log("status_id2str: id=" + id);
      var self = this;
      var ret = "";
      console.log(self.$myStore.state.status);
      self.$myStore.state.status.forEach(element => {
        if (id === element.id) {
          console.log("status_id2str: returning: " + element.text);
          ret = element.text;
        }
      });
      return ret;
    }
  },
  computed: {
    username() {
      var self = this;
      return self.$myStore.state.user.username;
    },
    fullname() {
      var self = this;
      return self.$myStore.state.user.fullname;
    },
    staff_role() {
      var self = this;
      return self.$myStore.state.user.staff_role;
    }
  },
  watch: {
    username(newUsername, old_username) {
      console.log(old_username + " => " + newUsername);
      this.menuItems = this.getMenu();
    },
    fullname(newFullname, oldFullname) {
      console.log(oldFullname + " => " + newFullname);
      this.menuItems = this.getMenu();
    },
    staff_role(newstaff_role, oldstaff_role) {
      console.log(oldstaff_role + " => " + newstaff_role);

      this.menuItems = this.getMenu();
    }
  },
  mounted() {}
};
</script>
