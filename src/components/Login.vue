<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-layout column>
          <v-flex>
            <v-text-field
              placeholder="Username"
              id="username"
              type="text"
              v-model="user.username"
              required
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field
              label="Password"
              id="password"
              type="password"
              v-model="user.password"
              required
            ></v-text-field>
          </v-flex>
          <!---
          <v-flex>
          <invisible-recaptcha sitekey="6Lc8NocUAAAAAHvMN69UATA5in5d8PqkaLU1iyQE" :callback="login()"
              class="btn btn-danger" type="submit" id="do-something-btn" :disabled="false">
              Do something!
          </invisible-recaptcha>
          
          </v-flex>
          -->
          <button @click="recaptcha">Execute captcha</button>
          <v-flex class="text-xs-center" mt-5>
            <v-btn color="primary" type="submit" @click="login">Sign In</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card>
      <v-snackbar
        v-model="snackbar"
        color="error"
        :multi-line="false"
        :timeout="5000"
        :vertical="false"
      >
        {{error}}
        <v-btn dark flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      snackbar: false,
      error: "",
      user: {
        username: "",
        password: "",
        role: ""
      },
      ready: false
    };
  },
  methods: {
    recaptcha() {
      var self = this;
      self.$recaptcha('login').then((token) => {
        console.log(token) // Will print the token
        self.ready=true;
        self.error = "Capcha ready";
        self.snackbar = true;
      })
    },
    login() {
      const self = this;
      if(self.ready == false)
      {
        self.error = "Capcha not ready";
        self.snackbar = true;
        return;
      }
      const data = {
        username: self.user.username,
        password: self.user.password
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      if (self.username != "" && self.password != "") {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + "users/login/", data)
          .then(res => {
            console.log(res.data);
            self.$myStore.state.user.username = res.data.username;
            self.$myStore.state.user.password = self.user.password;
            self.$myStore.state.user.fullname = res.data.fullname;
            self.$myStore.state.user.access_token = res.data.access_token;
            self.$myStore.state.user.refresh_token = res.data.refresh_token;
            self.$myStore.state.user.role = res.data.role;
            self.$myStore.state.user.email = res.data.email;

            self.$myStore.state.user.staff_role = res.data.role;
            if (res.data.role == 0) {
              self.$myStore.state.user.role = "admin";
            } else if (res.data.role == 1) {
              self.$myStore.state.user.role = "staff";
            } else if (res.data.role == 2) {
              self.$myStore.state.user.role = "customer";
            }
            console.log(self.$myStore.state.user);
            self.$router.push("/" + self.$myStore.state.user.role + "/");
          })
          .catch(e => {
            self.loading = false;
            self.error = "Login Failed";
            self.snackbar = true;
            console.log(e);
          });
      }
    },
    initReCaptcha: function() {
      var self = this;
      setTimeout(function() {
        if (typeof grecaptcha === "undefined") {
          self.initReCaptcha();
        } else {
          grecaptcha.render("recaptcha", {
            sitekey: "SITE_KEY",
            size: "invisible",
            badge: "inline",
            callback: self.submit
          });
        }
      }, 100);
    },
    validate: function() {
      // your validations...
      // ...
      grecaptcha.execute();
    },
    submit: function(token) {
      console.log(token);
    }
  }
};
</script>