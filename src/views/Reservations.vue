<template>
  <div class="content">
    <h1 class="h2 text-gray-800 mb-4">Reservations</h1>
    <b-table striped hover :items="formattedReservation"></b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Reservations",
  computed: {
    ...mapState({
      reservations: state => state.reservations
    }),
    formattedReservation() {
      return this.reservations.map(item => {
        return {
          id: item.id,
          status: item.status,
          booking_code: item.booking_reference,
          travel_date:
            item.journey_type === "1"
              ? item.travel_date
              : item.journey_type === "2"
              ? item.travel_date + " - " + item.return_date
              : "",
          journey_type:
            item.journey_type === "1"
              ? "One Way"
              : item.journey_type === "2"
              ? "Two Way"
              : "",
          travel_journey:
            item.journey_type === "1"
              ? item.departure_port
              : item.journey_type === "2"
              ? item.departure_port + " - " + item.return_port
              : "",
          total_pax: item.total_pax,
          payment: item.payment,
          received_on: item.created_at
        };
      });
    }
  },
  methods: {
    fetchReservations() {
      this.$store.dispatch("GET_RESERVATIONS");
    }
  },
  created() {
    this.fetchReservations();
  }
};
</script>

<style>
</style>