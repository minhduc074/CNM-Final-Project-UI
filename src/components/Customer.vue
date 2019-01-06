<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Bank Account</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-dialog v-model="dialog_internal_bank_transfer" max-width="50%">
      <v-btn slot="activator" color="primary">Internal transfer</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Internal transfer</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout column>
              <v-select :items="bank_account" label="Bank account" solo v-model="current_account"></v-select>
              <v-select :items="receiver_account" label="Receiver" solo v-model="receiver"></v-select>
              <v-text-field
                placeholder="Receiver"
                id="receiver"
                type="text"
                v-model="receiver"
                required
              ></v-text-field>
              <v-btn color="blue darken-1" flat @click.native="get_receiver">Check Receiver</v-btn>
              <v-flex>
                <v-text-field v-model="fullname" label="Full Name"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field v-model="email" label="Email"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field v-model="phone" label="Phone"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field v-model="money" label="money"></v-text-field>
              </v-flex>
              <v-btn color="blue darken-1" flat @click.native="get_capcha">Get Capcha</v-btn>
              <v-flex>
                <v-text-field v-model="otp" label="otp"></v-text-field>
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
    <v-data-table
      v-model="customer.selected"
      :headers="customer.headers"
      :items="customer.items"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.bank_account }}</td>
        <td class="text-xs-left">{{ props.item.balance }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog_internal_bank_transfer: false,
      bank_account: [],
      receiver_account: [],
      customer: {
        selected: [],
        headers: [
          {
            text: "Bank Account",
            align: "left",
            sortable: "desc",
            value: "bank_account"
          },
          {
            text: "Balance",
            align: "left",
            sortable: false,
            value: "balance"
          }
        ],
        items: []
      },
      current_account: 0,
      money: 0,
      receiver: "",
      fullname: "",
      email: "",
      phone: "",
      contents: "",
      otp: ""
    };
  },
  mounted() {
    this.getCustomerAccount();
    this.getReceiverAccount();
  },
  methods: {
    getCustomerAccount() {
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = { username: self.$myStore.state.user.username };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/getAll/", data, config)
        .then(res => {
          console.log(res.data);
          self.$myStore.state.customer = [];
          self.customer.items = self.$myStore.state.customer;
          res.data.forEach(customer => {
            console.log("customer: ");
            console.log(customer);
            var cus = {
              bank_account: customer.account_id,
              balance: customer.balance
            };
            //cus.status = self.status_id2str(customer.status);
            self.bank_account.push(cus.bank_account);

            self.$myStore.state.customer.push(cus);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    getReceiverAccount() {
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = { user_id: self.$myStore.state.user.username };
      console.log(data);
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/receiver/", data, config)
        .then(res => {
          console.log(res.data);
          res.data.forEach(receiver => {
            console.log("receiver: ");
            console.log(receiver);
            self.receiver_account.push(receiver.reveiver_id);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    saveReceiverAccount() {
      console.log("saveReceiverAccount")
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = { user_id: self.$myStore.state.user.username, reveiver_id:  self.receiver };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/add_receiver/", data, config)
        .then(res => {
          console.log(res.data);
          self.getReceiverAccount();
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    close_money() {
      this.dialog_internal_bank_transfer = false;
      setTimeout(() => {
        this.current_account = 0;
      }, 500);
    },

    save_money() {
      var self = this;
      console.log("Internal bank transfer");
      console.log(self.current_account);
      if (self.current_account == null || self.current_account == 0) {
        this.current_account = 0;
      } else {
        var data = {
          username: self.$myStore.state.user.username,
          sender_bank_id: self.current_account,
          receiver_bank_id: self.receiver,
          money: self.money,
          contents: self.contents, 
          otp: self.otp
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
            self.$myStore.state.wepAPI.url + "transactions/add",
            data,
            config
          )
          .then(res => {
            console.log(res.data);
            self.error = "Customer Successfully";
            self.snackbar = true;
            self.getCustomerAccount();
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
            if (e.response.status == 401 || e.response.status == 403)
              self.silence_login();
          });
      }

      self.saveReceiverAccount();

      self.close_money();
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
    },
    get_receiver(){
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = { account_id: self.receiver };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "accounts/user/", data, config)
        .then(res => {
          console.log(res.data);
          self.fullname = res.data.fullname;
          self.email = res.data.email;
          self.phone = res.data.phone;
          console.log (self.phone);
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    get_capcha(){
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = { username: self.$myStore.state.user.username, email: self.$myStore.state.user.email };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(self.$myStore.state.wepAPI.url + "transactions/get_otp/", data, config)
        .then(res => {
          console.log(res.data);
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
            self.$myStore.state.user.username = res.data.username;
            self.$myStore.state.user.password = self.user.password;
            self.$myStore.state.user.fullname = res.data.fullname;
            self.$myStore.state.user.access_token = res.data.access_token;
            self.$myStore.state.user.refresh_token = res.data.refresh_token;
            self.$myStore.state.user.role = role_url;
          })
          .catch(e => {
            self.loading = false;
            console.log(e);
          });
      }
    }
  }
};
</script>