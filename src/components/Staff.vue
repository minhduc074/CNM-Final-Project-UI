<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Customer List</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="50%">
        <v-btn slot="activator" color="primary">New Customer</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Customer</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout column>
                <v-flex>
                  <v-text-field v-model="editedItem.username" label="username"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="editedItem.fullname" label="fullname"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="editedItem.phone" label="phone"></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field v-model="editedItem.email" label="email"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close_create">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save_create">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      v-model="customer.selected"
      :headers="customer.headers"
      :items="customer.items"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.fullname }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
        </td>
      </template>
    </v-data-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      error: "",
      dialog: false,
      customer: {
        selected: [],
        headers: [
          {
            text: "ID",
            align: "left",
            sortable: "desc",
            value: "id"
          },
          {
            text: "Customer name",
            align: "left",
            sortable: false,
            value: "fullname"
          },
          {
            text: "Email",
            align: "left",
            sortable: false,
            value: "email"
          },
          {
            text: "Phone",
            align: "left",
            sortable: false,
            value: "phone"
          },
          {
            text: "status",
            align: "left",
            sortable: true,
            value: "status"
          },
          {
            text: "action",
            align: "left",
            sortable: false,
            value: "name"
          }
        ],
        items: []
      },
      editedItem: {
        username: "",
        fullname: "",
        password: "123456",
        phone: "",
        email: "",
        status: "0"
      }
    };
  },
  mounted() {
    this.getAllCustomer();
  },
  methods: {
    getAllCustomer() {
      var self = this;
      let config = {
        headers: {
          "x-access-token": self.$myStore.state.user.access_token
        }
      };
      console.log(config);
      self.loading = true;
      self.$axios
        .get(self.$myStore.state.wepAPI.url + "users/customers/", config)
        .then(res => {
          console.log(res.data);
          res.data.forEach(customer => {
            var cus = {
              id: customer.username,
              fullname: customer.fullname,
              email: customer.email,
              phone: customer.phone,
              status: self.status_id2str(customer.status),
              password: customer.password
            };
            //cus.status = self.status_id2str(customer.status);

            self.customer.items.push(cus);
          });
        })
        .catch(e => {
          self.loading = false;
          console.log(e);
          if (e.response.status == 401 || e.response.status == 403)
            self.silence_login();
        });
    },
    editItem(item) {
      var self = this;
      console.log(item);
      self.$myStore.state.current_customer = item;
      self.$router.push("/staff/editcustomer");
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
    },
    close_create() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save_create() {
      var self = this;
      if (this.editedIndex > -1) {
        Object.assign(this.customer.items[this.editedIndex], this.editedItem);
      } else {
        var data = {
          username: self.editedItem.username,
          password: self.editedItem.password,
          fullname: self.editedItem.fullname,
          phone: self.editedItem.phone,
          email: self.editedItem.email,
          role: 2,
          status: 0
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
          .post(self.$myStore.state.wepAPI.url + "users/register", data, config)
          .then(res => {
            self.editedItem.status = "open";
            self.editedItem.id = self.editedItem.username;
            self.customer.items.push(self.editedItem);
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
      self.close_create();
    }
  }
};
</script>