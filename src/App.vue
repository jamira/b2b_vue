<template>
  <div id="app">
    <Loading :active.sync="isLoading" :is-full-page="fullPage"></Loading>
    <div id="wrapper">
      <SideBar />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <TopNavBar />
          <div class="container-fluid">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loading from "vue-loading-overlay";
import SideBar from "@/components/SideBar";
import TopNavBar from "@/components/TopNavBar";
export default {
  name: "App",
  data() {
    return {
      fullPage: true
    };
  },
  components: {
    SideBar,
    TopNavBar,
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading
    })
  }
};
</script>

