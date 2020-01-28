<template>
  <div id="app">
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
import SideBar from "@/components/SideBar";
import TopNavBar from "@/components/TopNavBar";
export default {
  name: "App",
  components: {
    SideBar,
    TopNavBar
  }
};
</script>

