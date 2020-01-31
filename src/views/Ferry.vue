<template>
  <div class="content">
    <h1 class="h2 text-gray-800 mb-4">Ferry</h1>
    <b-row>
      <b-col xl="12">
        <FerrySearchForm />
        <FerryResults />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import FerrySearchForm from "@/components/Forms/FerrySearchForm.vue";
import FerryResults from "@/components/FerryResults.vue";
export default {
  name: "Ferry",
  components: {
    FerrySearchForm,
    FerryResults
  },
  computed: {
    dataFields() {
      return {
        booking_reference: "store.state.bookingDetails.BookingCode",
        journey_type: "store.state.bookingDetails.JourneyType",
        travel_date: "store.state.bookingDetails.TravelDate",
        return_date: "store.state.bookingDetails.ReturnTravelDate",
        departure_port: "store.state.bookingDetails.JourneyCode",
        return_port: "store.state.bookingDetails.ReturnJourneyCode",
        name: "store.state.bookingDetails.PassengerList.PassportName",
        passport_no: "store.state.bookingDetails.PassengerList.PassportNo",
        nationality: "Singaporean",
        birth_date: new Date(),
        issue_date: new Date(),
        passport_expiry: new Date()
      };
    }
  },
  methods: {
    fetchJourney() {
      this.$store.dispatch("GET_JOURNEY");
      this.$store.dispatch("LOG_ME_IN");
    }
  },
  async created() {
    await this.fetchJourney();
  }
};
</script>

<style>
</style>