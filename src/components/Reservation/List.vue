<template>
  <div id="reservation-list">
    <h1 class="h2 text-gray-800 mb-4">Reservations List</h1>
    <b-table striped borderless hover fixed head-variant="dark" :items="formattedReservation">
      <template v-slot:cell(status)="data">
        <div v-html="data.value"></div>
      </template>
      <template v-slot:cell(nationality)="data">
        <div v-html="data.value"></div>
      </template>
      <template v-slot:cell(depart_trip)="data">
        <div v-html="data.value"></div>
      </template>
      <template v-slot:cell(return_trip)="data">
        <div v-html="data.value"></div>
      </template>
      <template v-slot:cell(action)="row">
        <b-link :to="{ name: 'view', params: {id: row.value }}">View</b-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Reservations",
  data() {
    return {
      checked1: null
    };
  },
  components: {},
  computed: {
    ...mapState({
      reservations: state => state.reservations
    }),
    formattedReservation() {
      var tmpArry = [];
      for (let index = 0; index < this.reservations.length; index++) {
        const data = this.reservations[index];
        for (let index = 0; index < data.customers.length; index++) {
          const field = data.customers[index];
          tmpArry.push({
            status:
              "<span class='badge badge-success p-2'>" +
              data.status +
              "</span>",
            booking_code: data.booking_reference,
            passport_no: field.passport_no,
            nationality:
              "<span class='d-block'>" + field.nationality + "</span>",
            ticket_type:
              data.journey_type === "1"
                ? "One-Way"
                : data.journey_type === "2"
                ? "Two-Way"
                : "",
            depart_trip:
              "<span class='d-block'>" +
              data.departure_port +
              "</span>" +
              "<span class='d-block'>" +
              data.travel_date +
              "</span>" +
              "<span class='d-block'>" +
              data.travel_time +
              "</span>",
            return_trip:
              "<span class='d-block'>" +
              data.return_port +
              "</span>" +
              "<span class='d-block'>" +
              data.return_date +
              "</span>" +
              "<span class='d-block'>" +
              data.return_time +
              "</span>",
            ticket_price: data.payment,
            received_on: data.created_at,
            action: data.id
          });
        }
      }

      return tmpArry;
    }
  },
  methods: {
    fetchReservations() {
      this.$store.dispatch("GET_RESERVATIONS");
    },
    toggleDetails(row) {
      console.log(row);
    }
  },
  created() {
    this.fetchReservations();
  }
};
</script>
