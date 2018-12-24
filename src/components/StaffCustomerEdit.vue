<template>
  <v-container fill-height>
    <v-layout justify-center align-center v-if="profile">
      <v-flex xs12 sm8 md8 style="max-width: 600px">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Profile</v-toolbar-title>
          </v-toolbar>

          <v-flex class="ml-3 my-4">
            <v-avatar size="75px" class="mr-2">
              <img
                class="img-circle elevation-2"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Ry3j1IMhdhukL3SXCTW-q5MtEBDHu-oNlydFh-vMaY8h8LJYug"
              >
            </v-avatar>

            <v-btn color="primary" @click.native="create_bank_account">Create Bank Account</v-btn>
            <v-dialog v-model="dialog_new_bank_account" max-width="50%">
              <v-btn slot="activator" color="primary">Add Money</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">Add Money</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout column>
                      <v-select
                        :items="bank_account"
                        label="Bank account"
                        solo
                        v-model="current_account"
                      ></v-select>
                      <v-flex>
                        <v-text-field v-model="money" label="money"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close_money">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save_money">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>

          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="person"
                required
                v-model="profile.fullname"
                name="fullname"
                label="Full Name"
                type="text"
              ></v-text-field>
              <v-text-field
                v-if="user"
                prepend-icon="face"
                required
                v-model="user.username"
                name="username"
                label="Username"
                type="username"
              ></v-text-field>
              <v-text-field
                v-if="user"
                prepend-icon="lock"
                required
                v-model="user.password"
                name="password"
                label="Password"
                type="password"
              ></v-text-field>

              <v-text-field
                v-if="user"
                prepend-icon="phone"
                required
                v-model="user.phone"
                name="phone"
                label="Phone"
                type="phone"
              ></v-text-field>

              <v-text-field
                v-if="user"
                prepend-icon="mail"
                required
                v-model="user.email"
                name="email"
                label="Email"
                type="email"
              ></v-text-field>

              <v-checkbox
                v-if="user.status == 'Band'"
                :label="`Unlock this customer`"
                v-model="user.unlock"
              ></v-checkbox>
              <v-checkbox
                v-if="user.status == 'Open'"
                :label="`Lock this customer`"
                v-model="user.unlock"
              ></v-checkbox>

              <!--
              <v-text-field 
                v-model="this.profile.id" 
                hint="Create a unique URL for your profile. Many people use their first and last name. <br> [Ex: reel.ly/misha.collins]"
                persistent-hint
                id="username"  
                prepend-icon="link" 
                name="username" 
                required
                label="Profile URL " 
                type="text">
              </v-text-field>
              -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <p class="red-text center" v-if="feedback">{{ feedback }}</p> -->
            <v-btn flat @click.native="updatemyProfile" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card>
      <v-snackbar
        v-model="snackbar"
        color="success"
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
    const self = this;
    return {
      snackbar: false,
      error: "",
      user: {
        username: self.$myStore.state.current_customer.id,
        password: self.$myStore.state.current_customer.password,
        role: 2,
        phone: self.$myStore.state.current_customer.phone,
        email: self.$myStore.state.current_customer.email,
        status: self.$myStore.state.current_customer.status
      },
      profile: {
        fullname: self.$myStore.state.current_customer.fullname
      },
      unlock: false,
      new_bank_account: {
        username: "",
        fullname: "",
        password: "123456",
        phone: "",
        email: "",
        status: "0"
      },
      dialog_new_bank_account: false,
      money: 0,
      bank_account: [],
      current_account: 0
    };
  },
  mounted() {
    this.get_bank_account();
  },
  methods: {
    updatemyProfile() {
      const self = this;
      const data = {
        username: self.user.username,
        password: self.user.password,
        fullname: self.profile.fullname,
        email: self.user.email,
        status: self.user.unlock == true ? 0 : 1,
        phone: self.user.phone,
        role: self.user.role
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      if (self.user.status == "Open") {
        if (data.status == 0) data.status = 1;
        else data.status = 0;
      }
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      console.log(config);
      console.log(data);

      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "users/update/", data, config)
        .then(res => {
          console.log(res.data);
          console.log(self.$myStore.state.user);
          self.$router.push("/staff");
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    silence_login() {
      var self = this;
      const data = {
        username: self.$myStore.state.user.username,
        password: self.$myStore.state.user.password
      };
      console.log("silence_login");
      var role_url = self.$myStore.state.user.role;
      if (
        self.$myStore.state.user.username != "" &&
        self.$myStore.state.user.password != ""
      ) {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + role_url + "/login/", data)
          .then(res => {
            console.log(res.data);
            self.$myStore.state.user.fullname = res.data.fullname;
            self.$myStore.state.user.access_token = res.data.access_token;
            self.$myStore.state.user.refresh_token = res.data.refresh_token;
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    },
    create_bank_account() {
      const self = this;
      const data = {
        username: self.user.username
      };
      // checking if the input is valid
      //if (this.$refs.form.validate()) {

      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      console.log(config);
      console.log(data);

      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/add/", data, config)
        .then(res => {
          console.log(res.data);
          self.error = "Add Bank Account Successfully";
          self.snackbar = true;
          self.get_bank_account();
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    close_money() {
      this.dialog_new_bank_account = false;
      setTimeout(() => {
        this.current_account = 0;
      }, 300);
    },

    save_money() {
      var self = this;
      console.log(self.current_account);
      if (self.current_account == null || self.current_account == 0) {
        Object.assign(this.customer.items[this.editedIndex], this.editedItem);
      } else {
        var data = {
          account_id: self.current_account,
          money: self.money
        };

        console.log(data);

        let config = {
          headers: {
            "x-access-token": self.$myStore.state.user.access_token
          }
        };
        console.log(config);
        self.loading = true;
        self.$axios
          .post(
            self.$myStore.state.wepAPI.url + "accounts/addBal",
            data,
            config
          )
          .then(res => {
            console.log(res.data);
            self.error = "Add Customer Successfully";
            self.snackbar = true;
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
            if (e.response.status == 401 || e.response.status == 403)
              self.silence_login();
          });
      }
      self.close_money();
    },

    get_bank_account() {
      console.log("get bank account");
      var self = this;
      var data = {
        username: self.user.username
      };

      console.log(data);

      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/getAll", data, config)
        .then(res => {
          console.log(res.data);
          res.data.forEach(account => {
            console.log(account);

            self.bank_account.push(account.account_id);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    }
  }
};
</script>