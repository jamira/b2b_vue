<template>
  <div id="reservation-detail">
    <h1 class="h2 text-gray-800 mb-4">Reservation Detail</h1>
    <b-row>
      <b-col xl="4" md="12">
        <b-card class="shadow" header="Trip Summary" header-tag="div">
          <b-list-group id="reservation-details" class="list-group-no-border">
            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Code:</span>
              <h5>{{ bookingDetail.booking_reference }}</h5>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Date:</span>
              <span>{{ bookingDetail.created_at }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Travel Port:</span>
              <span>{{ bookingDetail.departure_port }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Travel Date:</span>
              <span>{{ bookingDetail.travel_date }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Travel Time:</span>
              <span>{{ bookingDetail.travel_time }}</span>
            </b-list-group-item>

            <div v-if="bookingDetail.journey_type === '2'">
              <b-list-group-item class="d-flex justify-content-between py-1">
                <span class="text-muted d-block">Return Travel Port:</span>
                <span>{{ bookingDetail.return_port }}</span>
              </b-list-group-item>

              <b-list-group-item class="d-flex justify-content-between py-1">
                <span class="text-muted d-block">Return Travel Date:</span>
                <span>{{ bookingDetail.return_date }}</span>
              </b-list-group-item>

              <b-list-group-item class="d-flex justify-content-between py-1">
                <span class="text-muted d-block">Return Travel Time:</span>
                <span>{{ bookingDetail.return_time }}</span>
              </b-list-group-item>
            </div>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Created By:</span>
              <span>{{ currentUser.name }}</span>
            </b-list-group-item>
          </b-list-group>

          <template v-slot:footer>
            <b-button
              variant="secondary"
              size="sm"
              class="mr-2"
              @click="downloadBooking"
            >Download Booking Itinerary</b-button>
            <b-button variant="secondary" size="sm">Email Booking Itinerary</b-button>
            <!-- <b-button variant="danger" size="sm" class="float-right">Edit Booking</b-button> -->
          </template>
        </b-card>
      </b-col>

      <b-col xl="4" md="12">
        <b-card class="shadow" header="Payment Summary" header-tag="div">
          <b-list-group id="reservation-details" class="list-group-no-border">
            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Total Pax:</span>
              <span>{{ bookingDetail.adult + bookingDetail.child }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1" v-if="isInsurance > 0">
              <span class="text-muted d-block">Travel Insurance:</span>
              <span>{{ isInsurance * 5 | currency }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1" v-if="isClearance > 0">
              <span class="text-muted d-block">Express Clearance:</span>
              <span>{{ isClearance * 10 | currency }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1 mt-2">
              <span class="text-muted d-block">Total Price:</span>
              <h5>{{ bookingDetail.payment | currency }}</h5>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>

      <b-col xl="4" md="12">
        <b-card class="shadow" header="Passenger(s)" header-tag="div">
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
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jsPDF from "jspdf";
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
      bookingDetail: state => state.reservationById,
      currentUser: state => state.currentUser
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
    },
    isClearance() {
      const isClearance = this.bookingDetail.customers.filter(
        item => item.express_clearance
      );

      return isClearance.length;
    },
    isInsurance() {
      const isInsurance = this.bookingDetail.customers.filter(
        item => item.travel_insurance
      );

      return isInsurance.length;
    }
  },
  methods: {
    getReservation() {
      this.$store.dispatch("GET_RESERVATION_BY_ID", this.$route.params.id);
    },
    downloadBooking() {
      let fileName = "booking_itinerary";
      var doc = new jsPDF();
      doc.text("Reservation Details", 10, 10);
      doc.save(fileName + ".pdf");
    }
  },
  async created() {
    await this.getReservation();
  }
};
</script>

<style>
</style>