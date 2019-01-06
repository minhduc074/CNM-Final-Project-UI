<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Bank Account</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>
    
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
      }
    };
  },
  mounted() {
    this.getCustomerAccount();
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