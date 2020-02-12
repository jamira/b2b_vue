<template>
  <div>
    <div ref="content">
      <div style="width: 800px; margin: 0 auto; padding: 0 10px;">
        <div class="header" style="padding:20px; 10px;">
          <div class="float-left">
            <b-img :src="logo" alt="THK Tour" width="450"></b-img>
          </div>
          <div class="float-right" style="color: #000;">
            <span style="text-transform: uppercase; font-size: 13px">Booking Code</span>
            <h4>{{ formattedBookingDetails[0].booking_code }}</h4>
          </div>
        </div>

        <div
          class="booking-info py-3"
          style="clear: both; color: #000; font-size: 13px; padding:0 10px;"
        >
          <ul class="list-unstyled m-0">
            <li>
              <strong>Booking Name:</strong>
              {{ formattedBookingDetails[0].booking_name }}
            </li>
            <li>
              <strong>Status:</strong>
              {{ formattedBookingDetails[0].status }}
            </li>
            <li>
              <strong>Booking Date:</strong>
              {{ formattedBookingDetails[0].booking_date }}
            </li>
            <li>
              <strong>Total Pax:</strong> Total Pax
            </li>
          </ul>
        </div>
        <div class="booking-details" style="padding:0 10px;">
          <b-table
            :items="formattedTravelDetails"
            striped
            style="color: #000; font-size: 13px;"
            class="mb-4"
            caption-top
          >
            <template v-slot:table-caption>
              <strong style="color: #000;">Travel Details</strong>
            </template>
          </b-table>

          <b-table
            :items="formattedPassengers"
            striped
            style="color: #000; font-size: 13px;"
            class="mb-4"
            caption-top
          >
            <template v-slot:cell(DepartPort)="data">
              <div v-html="data.value"></div>
            </template>
            <template v-slot:cell(ReturnPort)="data">
              <div v-html="data.value" v-if="bookingDetail.journey_type === '2'"></div>
              <div v-else>None</div>
            </template>

            <template v-slot:table-caption>
              <strong style="color: #000;">Passenger(s)</strong>
            </template>
          </b-table>

          <b-table
            :items="servicesFee"
            style="color: #000; font-size: 13px;"
            class="mb-4"
            caption-top
          >
            <template v-slot:table-caption>
              <strong style="color: #000;">Ferry Ticket Fare & Service Fees Details</strong>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <b-button variant="secondary" size="sm" @click="emailBooking">Email Booking Itinerary</b-button>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import logo from "../../assets/thk-letter-head.png";
import { mapState } from "vuex";
export default {
  name: "Passenger",
  data() {
    return {
      logo: logo
    };
  },
  computed: {
    ...mapState({
      searchQuery: state => state.searchQuery,
      bookingDetails: state => state.bookingDetails,
      totalAmount: state => state.totalAmount,
      passengerList: state => state.passengers,
      summaryTrip: state => state.bookings
    }),
    formattedBookingDetails() {
      return this.bookingDetails.map(item => {
        return {
          booking_name: item.BookingName,
          booking_code: item.BookingCode,
          booking_date: this.$moment().format("dddd. DD MMMM. YYYY"),
          status: "Confirmed"
        };
      });
    },
    formattedTravelDetails() {
      return this.bookingDetails.map(item => {
        return {
          depature:
            item.JourneyCode +
            " (" +
            this.$moment(item.TravelDate).format("dd. DD MMM. YYYY") +
            " " +
            item.TravelTime +
            ")",
          return:
            item.JourneyType === "2"
              ? item.ReturnJourneyCode +
                " (" +
                this.$moment(item.ReturnTravelDate).format(
                  "dddd. DD MMMM. YYYY"
                ) +
                " " +
                item.ReturnTravelTime +
                ")"
              : "None",
          seat_category: item.SeatCategory
        };
      });
    },
    formattedPassengers() {
      return this.passengerList.map(item => {
        return {
          passport_name: item.PassportName,
          passport_no: item.PassportNo,
          nationality: item.Nationality,
          JourneyType: item.journey_type === "2" ? "Two-Way" : "One-Way",
          travel_insurance: item.TravelInsurance ? "Yes" : "No",
          express_clearance: item.ExpressClearance ? "Yes" : "No"
        };
      });
    },
    servicesFee() {
      return [
        {
          ferryTicket: "Paid",
          surcharges: "Paid",
          TerminalFees: "Paid"
        }
      ];
    }
  },
  methods: {
    saveData() {
      let passengers = [];

      this.passengerList.forEach(data => {
        passengers.push({
          name: data.PassportName,
          passport_no: data.PassportNo,
          nationality: data.Nationality,
          birth_date: data.BirthDate,
          issue_date: data.PassportIssueDate,
          passport_expiry: data.PassportExpiredDate,
          travel_insurance: data.TravelInsurance,
          express_clearance: data.ExpressClearance
        });
      });

      let reservation = {
        booking_reference: this.bookingDetails[0].BookingCode,
        status: "Confirmed",
        journey_type: this.bookingDetails[0].JourneyType,
        travel_date: this.bookingDetails[0].TravelDate,
        travel_time: this.bookingDetails[0].TravelTime,
        return_date:
          this.bookingDetails[0].JourneyType === "2"
            ? this.bookingDetails[0].ReturnTravelDate
            : "",
        return_time:
          this.bookingDetails[0].JourneyType === "2"
            ? this.bookingDetails[0].ReturnTravelTime
            : "",
        departure_port: this.bookingDetails[0].JourneyCode,
        return_port:
          this.bookingDetails[0].JourneyType === "2"
            ? this.bookingDetails[0].ReturnJourneyCode
            : "",
        total_pax: this.summaryTrip.TotalPax,
        adult: this.summaryTrip.adult,
        child: this.summaryTrip.child,
        payment: this.totalAmount,
        booking_date: this.$moment().format("YYYY-MM-DD"),
        customers: passengers
      };

      this.$store.dispatch("INSERT_RESERVATION", { reservation: reservation });
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
            iterinaryFile: pdfAsString
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
  created() {
    this.saveData();
  }
};
</script>

<style>
</style>