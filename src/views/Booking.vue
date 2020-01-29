<template>
  <div id="customer-booking">
    <PassengerForm v-if="$route.query.create === 'ferry'" />
    <Success v-if="$route.query.create === 'success'" />
  </div>
</template>

<script>
import PassengerForm from "../components/Forms/Passenger";
import Success from "../components/Success";
export default {
  name: "Booking",
  components: {
    PassengerForm,
    Success
  }
};
</script>

<style>
</style>