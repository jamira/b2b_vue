<template>
  <b-navbar toggleable="md" type="light" variant="light" class="shadow topbar mb-4 static-top">
    <b-navbar-brand>
      <b-img :src="logo" v-bind="mainProps" fluid alt="THK Tour"></b-img>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/top-up">Account Balance: {{ getCurrentUser.account_balance | currency }}</b-nav-item>
        <div class="topbar-divider d-none d-sm-block"></div>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <div>
              Howdy,
              <span class="py-2">{{ getCurrentUser.name }}</span>
            </div>
          </template>
          <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
import logo from "../assets/logo.png";
export default {
  name: "TopNavBar",
  data() {
    return {
      logo: logo,
      mainProps: {
        center: true,
        width: 80,
        height: 80,
        class: "my-5"
      }
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    }),
    getCurrentUser() {
      return this.$session.get("currentUser");
    }
  },
  methods: {
    logOut() {
      this.$session.destroy();
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style>
</style>
