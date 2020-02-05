<template>
  <div id="reservation-detail">
    <h1 class="h2 text-gray-800 mb-4">Reservation Detail</h1>
    <b-row>
      <b-col xl="6" md="12">
        <b-card class="shadow mb-4" header="Reservation Info" header-tag="div">
          <b-list-group id="reservation-details" class="list-group-no-border">
            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Status</span>
              <b-badge variant="success" class="p-2">{{ bookingDetail.status }}</b-badge>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Code:</span>
              <span>{{ bookingDetail.booking_reference }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Date:</span>
              <span>{{ bookingDetail.created_at }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Payment:</span>
              <span>{{ bookingDetail.payment | currency }}</span>
            </b-list-group-item>
          </b-list-group>
          <template v-slot:footer>
            <b-button variant="secondary" size="sm" class="mr-2">Download Booking Itinerary</b-button>
            <b-button variant="secondary" size="sm">Email Booking Itinerary</b-button>
            <!-- <b-button variant="danger" size="sm" class="float-right">Edit Booking</b-button> -->
          </template>
        </b-card>
      </b-col>
      <b-col xl="6" md="12">
        <b-card class="shadow mb-4" header="Passenger(s)" header-tag="div">
          <b-list-group
            v-for="(passenger, key) in formattedCustomers"
            :key="key"
            :id="'passenger-detail-' + key"
            class="list-group-no-border mb-4"
          >
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Passport Name:</span>
              <span>{{ passenger.PassportName }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Passport No:</span>
              <span>{{ passenger.PassportNo }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Nationality:</span>
              <span>{{ passenger.Nationality }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Date Of Birth:</span>
              <span>{{ passenger.DateOfBirth }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Passport Date Issue:</span>
              <span>{{ passenger.PassportDateIssue }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Passport Expiry Date:</span>
              <span>{{ passenger.PassportExpiryDate }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Travel Insurance:</span>
              <span>{{ passenger.TravelInsurance }}</span>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between p-1">
              <span class="text-muted d-block">Express Clearance:</span>
              <span>{{ passenger.ExpressClearance }}</span>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "viewsss",
  data() {
    return {
      post: null,
      error: null
    };
  },
  computed: {
    ...mapState({
      bookingDetail: state => state.reservationById
    }),
    formattedCustomers() {
      return this.bookingDetail.customers.map(item => {
        return {
          PassportName: item.name,
          PassportNo: item.passport_no,
          Nationality: item.nationality,
          DateOfBirth: item.birth_date,
          PassportDateIssue: item.issue_date,
          PassportExpiryDate: item.passport_expiry,
          TravelInsurance: item.travel_insurance ? "Yes" : "No",
          ExpressClearance: item.express_clearance ? "Yes" : "No"
        };
      });
    }
  },
  methods: {
    getReservation() {
      this.$store.dispatch("GET_RESERVATION_BY_ID", this.$route.params.id);
    }
  },
  async created() {
    await this.getReservation();
  }
};
</script>

<style>
</style>