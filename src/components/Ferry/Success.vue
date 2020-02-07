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
      <b-table striped hover :items="formattedPassengers"></b-table>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Passenger",
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
          issue_date: item.PassportIssueDate,
          expiry_date: item.PassportExpiredDate,
          nationality: item.Nationality,
          birth_date: item.BirthDate,
          travel_insurance: item.TravelInsurance ? "Yes" : "No",
          express_clearance: item.ExpressClearance ? "Yes" : "No"
        };
      });
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
    }
  },
  created() {
    this.saveData();
  }
};
</script>

<style>
</style>