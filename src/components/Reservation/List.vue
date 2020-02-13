<template>
  <div id="reservation-list" class="overflow-auto">
    <h1 class="h2 text-gray-800 mb-4">Booking List</h1>
    <b-table
      striped
      hover
      responsive
      head-variant="dark"
      id="booking-list"
      :items="formattedReservation"
      :per-page="perPage"
      :current-page="currentPage"
    >
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
        <b-link :to="{ name: 'view', params: {id: row.value }}" class="mr-3">View</b-link>
        <b-link @click.prevent="onCancel(row.value)">Cancel</b-link>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="booking-list"
    ></b-pagination>
    <!-- <pre>{{ formattedReservation }}</pre> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Reservations",
  data() {
    return {
      checked1: null,
      isCancel: "",
      perPage: 8,
      currentPage: 1
    };
  },
  components: {},
  computed: {
    ...mapState({
      reservations: state => state.reservations
    }),
    formattedReservation() {
      let list = this.reservations;
      var tmpArray = [];
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        let data = {
          status:
            "<span class='badge badge-success p-2'>" +
            element.status +
            "</span>",
          booking_code: element.booking_reference,
          passport_no: element.customers[0].passport_no,
          nationality:
            "<span class='d-block'>" +
            element.customers[0].nationality +
            "</span>",
          ticket_type:
            element.journey_type === "1"
              ? "One Way"
              : element.journey_type === "2"
              ? "Two Way"
              : "",
          depart_trip:
            "<span class='d-block'>" +
            element.departure_port +
            "</span>" +
            "<span class='d-block'>" +
            element.travel_date +
            "</span>" +
            "<span class='d-block'>" +
            element.travel_time +
            "</span>",
          return_trip:
            "<span class='d-block'>" +
            element.return_port +
            "</span>" +
            "<span class='d-block'>" +
            element.return_date +
            "</span>" +
            "<span class='d-block'>" +
            element.return_time +
            "</span>",
          ticket_price: element.payment,
          received_on: element.created_at,
          action: element.id
        };
        tmpArray.push(data);
      }

      return tmpArray;
    },
    rows() {
      return this.formattedReservation.length;
    }
  },
  methods: {
    fetchReservations() {
      this.$store.dispatch("GET_RESERVATIONS");
    },
    onCancel(ID) {
      this.$confirm({
        title: "Confirm",
        content: `Are you sure to cancel Booking ID ${ID}?`
      })
        .then(success => {
          // Ok button pressed
          if (success) {
            console.log(success);
          }
        })
        .catch(cancel => {
          // Cancel button pressed
          if (cancel) {
            console.log(cancel);
          }
        });
    }
  },
  created() {
    this.fetchReservations();
  }
};
</script>
