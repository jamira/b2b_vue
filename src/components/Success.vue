<template>
  <div>
    <h1 class="h2 text-gray-800 mb-4">Success</h1>
    <b-card class="shadow mb-4" header="Booking Details" header-tag="div">
      <b-table striped hover :items="formattedBookingDetails"></b-table>
    </b-card>
    <b-card class="shadow mb-4" header="Travel Details" header-tag="div">
      <b-table striped hover :items="formattedTravelDetails"></b-table>
    </b-card>
    <b-card class="shadow mb-4" header="Passenger Details" header-tag="div">
      <ol v-for="(booking, key) in bookingDetails" :key="key">
        <li v-for="(name, key) in booking.PassengerList" :key="key">
          <span class="d-block">{{ name.PassportName }} ({{ name.PassportNo }})</span>
        </li>
      </ol>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Passenger",
  computed: {
    ...mapGetters(["bookingDetails", "searchQuery"]),
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
          arrival:
            item.JourneyType === "2"
              ? item.ReturnJourneyCode +
                " (" +
                this.$moment(item.ReturnTravelDate).format(
                  "dddd. DD MMMM. YYYY"
                ) +
                " " +
                item.ReturnTravelTime +
                ")"
              : "Not Available",
          seat_category: item.SeatCategory
        };
      });
    }
  },
  methods: {
    saveData() {
      let dataFields = {
        reservation: {
          status: "confirmed",
          booking_reference: this.bookingDetails[0].BookingCode,
          journey_type: this.bookingDetails[0].JourneyType,
          travel_date: this.bookingDetails[0].TravelDate,
          return_date:
            this.bookingDetails[0].JourneyType === "2"
              ? this.bookingDetails[0].ReturnTravelDate
              : "",
          departure_port: this.bookingDetails[0].JourneyCode,
          return_port:
            this.bookingDetails[0].JourneyType === "2"
              ? this.bookingDetails[0].ReturnJourneyCode
              : "",
          total_pax: this.searchQuery.TotalPax,
          payment: 50.0,
          booking_date: this.$moment().format("YYYY-MM-DD"),
          travel_insurance: false,
          express_clearance: false
        },
        customer: {
          name: "Johnny Applessed",
          passport_no: "ET5311892",
          nationality: "Singaporean",
          birth_date: "1990-08-26",
          issue_date: "2014-08-20",
          passport_expiry: "2020-08-20"
        }
      };

      this.$store.dispatch("INSERT_RESERVATION", dataFields);
    }
  },
  created() {
    this.saveData();
  }
};
</script>

<style>
</style>