<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Reservations",
  methods: {
    doAuth() {
      this.$store.dispatch("LOG_ME_IN");
    }
  },
  async created() {
    await this.doAuth();
  }
};
</script>