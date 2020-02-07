<template>
  <div id="bookings">
    <Success v-if="$route.query.status === 'success'" />
    <BookingForm v-else />
  </div>
</template>

<script>
import { mapState } from "vuex";
import BookingForm from "./BookingForm.vue";
import Success from "./Success";
export default {
  name: "Bookings",
  components: {
    BookingForm,
    Success
  },
  computed: {
    ...mapState({
      travelInsurance: state => state.travelInsurance
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm({
      title: "Confirm",
      content: "Are you sure you want to leave this page?"
    })
      .then(success => {
        // Ok button pressed
        if (success) {
          this.$store.commit("SET_EXPRESS_CLEARANCE", false);
          this.$store.commit("SET_SCHEDULE", []);
          this.travelInsurance.find(item => {
            item.TravelInsurance = false;
          });

          console.log(success);
          next();
        }
      })
      .catch(cancel => {
        // Cancel button pressed
        if (cancel) {
          console.log(cancel);
          next(false);
        }
      });
  }
};
</script>

<style>
</style>