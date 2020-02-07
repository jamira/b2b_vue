<template>
  <div id="reservation-detail">
    <h1 class="h2 text-gray-800 mb-4">Booking Detail</h1>
    <b-row>
      <b-col xl="3" md="12">
        <b-card class="shadow" header="Trip Summary" header-tag="div">
          <b-list-group id="reservation-details" class="list-group-no-border">
            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Code:</span>
              <span>{{ bookingDetail.booking_reference }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Booking Date:</span>
              <span>{{ bookingDetail.created_at }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Journey Type:</span>
              <span>{{ bookingDetail.journey_type === 2 ? 'Two Way' : 'One Way' }}</span>
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
              <span class="text-muted d-block">Total Pax:</span>
              <span>{{ bookingDetail.adult + bookingDetail.child }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1">
              <span class="text-muted d-block">Created By:</span>
              <span>{{ currentUser.name }}</span>
            </b-list-group-item>

            <b-list-group-item class="d-flex justify-content-between py-1 mt-2">
              <span class="text-muted d-block">Total Payment:</span>
              <h4>{{ bookingDetail.payment | currency }}</h4>
            </b-list-group-item>
          </b-list-group>

          <template v-slot:footer>
            <b-button
              variant="secondary"
              size="sm"
              @click="downloadBooking"
              block
            >Download Booking Itinerary</b-button>
            <b-button variant="secondary" size="sm" block>Email Booking Itinerary</b-button>
          </template>
        </b-card>
      </b-col>

      <b-col xl="9" md="12">
        <b-card class="shadow" header="Bookings" header-tag="div">
          <b-table :items="formattedCustomers" id="passenger-table" responsive caption-top>
            <template
              v-slot:table-caption
            >Total of {{ formattedCustomers.length }} {{formattedCustomers.length > 1 ? 'Passengers' : 'Passenger'}} list</template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="passenger-table"
            size="sm"
          ></b-pagination>
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
      perPage: 10,
      currentPage: 1
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
          Name: item.name,
          PassportNo: item.passport_no,
          PassportDateIssue: item.issue_date,
          PassportExpiryDate: item.passport_expiry,
          Nationality: item.nationality,
          DOB: item.birth_date,
          Insurance: item.travel_insurance ? "Yes" : "No",
          Clearance: item.express_clearance ? "Yes" : "No"
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
    },
    rows() {
      return this.formattedCustomers.length;
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