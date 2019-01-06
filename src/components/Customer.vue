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
    <v-dialog v-model="dialog_transacsion_history" max-width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">Transactions History</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-data-table
              v-model="current_transacsion_history.selected"
              :headers="current_transacsion_history.headers"
              :items="current_transacsion_history.items"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.type }}</td>
                <td>{{ props.item.transaction_id }}</td>
                <td class="text-xs-left">{{ props.item.sender_bank_id }}</td>
                <td class="text-xs-left">{{ props.item.receiver_bank_id }}</td>
                <td class="text-xs-left">{{ props.item.money }}</td>
                <td class="text-xs-left">{{ props.item.contents }}</td>
                <td class="text-xs-left">{{ props.item.transfer_date }}</td>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close_transacsion">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_confirm" max-width="20%">
      <v-card>
        <v-card-title>
          <span class="headline">Are you sure?</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="confirm_yes">Yes</v-btn>
          <v-btn color="blue darken-1" flat @click.native="confirm_no">No</v-btn>
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
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="viewTransacsion(props.item)">search</v-icon>
          <v-icon small class="mr-2" @click="showConfirmDialog(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      dialog_internal_bank_transfer: false,
      current_account: 0,
      money: 0,
      receiver: "",
      contents: "",

      dialog_transacsion_history: false,
      current_transacsion_history: {
        selected: [],
        headers: [
          {
            text: "Type",
            align: "left",
            sortable: "desc",
            value: "type"
          },
          {
            text: "ID",
            align: "left",
            sortable: "desc",
            value: "transaction_id"
          },
          {
            text: "Sender",
            align: "left",
            sortable: false,
            value: "sender_bank_id"
          },
          {
            text: "Receiver",
            align: "left",
            sortable: "desc",
            value: "receiver_bank_id"
          },
          {
            text: "Money",
            align: "left",
            sortable: "desc",
            value: "money"
          },
          {
            text: "Note",
            align: "left",
            sortable: "desc",
            value: "contents"
          },
          {
            text: "Date",
            align: "left",
            sortable: "desc",
            value: "transfer_date"
          }
        ],
        items: []
      },
      dialog_confirm: false,
      account_delete: "",
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
    showConfirmDialog(item) {
      var self = this;
      self.account_delete = item.bank_account;
      self.dialog_confirm = true;
    },
    confirm_yes() {
      var self = this;
      self.deleteAccount();
      self.dialog_confirm = false;
    },
    confirm_no() {
      var self = this;
      self.account_delete = "";
      self.dialog_confirm = false;
    },
    viewTransacsion(item) {
      var self = this;
      self.current_transacsion_history.items = [];
      console.log(item);

      var data = {
        sender_bank_id: item.bank_account
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
          self.$myStore.state.wepAPI.url + "transactions/get_by_sender",
          data,
          config
        )
        .then(res => {
          console.log(res.data);
          res.data.forEach(trans => {
            console.log("trans: ");
            console.log(trans);
            trans.type = "Sent";

            self.current_transacsion_history.items.push(trans);
          });
          var data = {
            account_id: item.bank_account
          };
          self.$axios
            .post(
              self.$myStore.state.wepAPI.url + "transactions/get_by_receiver",
              data,
              config
            )
            .then(res => {
              console.log(res.data);
              res.data.forEach(trans => {
                console.log("trans: ");
                console.log(trans);
                trans.type = "Received";

                self.current_transacsion_history.items.push(trans);
              });
            })
            .catch(e => {
              self.loading = false;
              console.log(e);
              if (e.response.status == 401 || e.response.status == 403)
                self.silence_login();
            });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });

      self.dialog_transacsion_history = true;
    },
    deleteAccount(item) {
      var self = this;
      self.current_transacsion_history.items = [];
      console.log(item);

      var data = {
        account_id: self.account_delete
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
        .post(self.$myStore.state.wepAPI.url + "accounts/remove", data, config)
        .then(res => {
          console.log(res.data);
          self.error = "Deleted";
          self.snackbar = true;
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
          self.error = "Delete failed";
          self.snackbar = true;
        });
    },
    close_transacsion() {
      this.dialog_transacsion_history = false;
      setTimeout(() => {
        this.current_transacsion_history.items = [];
      }, 300);
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
    get_receiver() {
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
          console.log(self.phone);
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    get_capcha() {
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      var data = {
        username: self.$myStore.state.user.username,
        email: self.$myStore.state.user.email
      };
      console.log(config);
      self.loading = true;
      self.$axios
        .post(
          self.$myStore.state.wepAPI.url + "transactions/get_otp/",
          data,
          config
        )
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