<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Bank Account</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>
    
    <v-card-text>
            <v-container grid-list-md>
              <v-layout column>
                <v-flex>
                  <v-text-field v-model="bank_account" label="Current Bank Balance" readonly></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog_internal_bank_transfer: false,
      bank_account: 0,
      customer: {
        selected: [],
        headers: [

          {
            text: "Balance",
            align: "left",
            sortable: false,
            value: "balance"
          }
        ],
        items: []
      }
    };
  },
  mounted() {
    this.getAllBal();
  },
  methods: {
    getAllBal() {
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
        .post(self.$myStore.state.wepAPI.url + "accounts/getAllBal/", data, config)
        .then(res => {
          console.log(res.data);
          res.data.forEach(customer => {
            console.log("customer: ");
            console.log(customer);
            var cus = {
              bank_account: customer.account_id,
              balance: customer.balance
            };
            //cus.status = self.status_id2str(customer.status);
            self.bank_account += customer.balance;
            console.log(self.bank_account);

          });
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
        rfToken: self.$myStore.state.user.rfToken
      };
      console.log("silence_login");
      var role_url = "users";
      if (
        self.$myStore.state.user.username != "" &&
        self.$myStore.state.user.rfToken != ""
      ) {
        self.loading = true;
        self.$axios
          .post(self.$myStore.state.wepAPI.url + role_url + "/silence_login/", data)
          .then(res => {
            console.log(res.data);
            self.$myStore.state.user.access_token = res.data.access_token;
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