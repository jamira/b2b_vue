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
              <span>{{ bookingDetail.journey_type === '2' ? 'Two Way' : 'One Way' }}</span>
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
    <div ref="content" v-show="false">
      <BookingItinerary :ID="this.$route.params.id" />
    </div>
  </div>
</template>

<script>
import BookingItinerary from "../Ferry/BookingItinerary";
import { mapState } from "vuex";
import html2pdf from "html2pdf.js";
export default {
  name: "View-Booking",
  data() {
    return {
      perPage: 10,
      currentPage: 1
    };
  },
  components: {
    BookingItinerary
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
    rows() {
      return this.formattedCustomers.length;
    }
  },
  methods: {
    getReservation() {
      this.$store.dispatch("GET_RESERVATION_BY_ID", this.$route.params.id);
    },
    downloadBooking() {
      const contentHtml = this.$refs.content.innerHTML;
      var opt = {
        filename: "travel_itinerary.pdf",
        jsPDF: {
          setFontSize: 13,
          unit: "mm",
          format: "a4"
        }
      };
      html2pdf()
        .set(opt)
        .from(contentHtml)
        .save();
    },
    emailBooking() {
      const contentHtml = this.$refs.content.innerHTML;
      var opt = {
        filename: "travel_itinerary.pdf",
        jsPDF: {
          setFontSize: 13,
          unit: "mm",
          format: "a4"
        }
      };
      html2pdf()
        .set(opt)
        .from(contentHtml)
        .toPdf()
        .output("datauristring")
        .then(pdfAsString => {
          let data = {
            iterinaryFile: pdfAsString,
            emailName: "THK Team",
            emailContent: "Hello, Attached is Booking Itinerary"
          };
          this.$store.dispatch("SEND_BOOKING_EMAIL", data);
          this.$alert({
            title: "THK Message",
            content:
              "Itirenary is succesfully sent to your email. Please check."
          });
        });
    }
  },
  async created() {
    await this.getReservation();
  }
};
</script>
