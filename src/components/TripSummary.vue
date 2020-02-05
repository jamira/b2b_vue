<template>
  <b-list-group class="list-group-no-border">
    <b-alert :show="noTerminalFees" variant="info">{{ noTerminalFees }}</b-alert>
    <b-list-group-item class="py-1">
      <span
        class="text-muted mb-1 d-block"
      >{{ searchQuery.TotalPax > 1 ? 'Passengers' : 'Passenger'}}</span>
      <span
        class="d-block"
        v-if="searchQuery.adult > 0"
      >{{ searchQuery.adult > 1 ? `${searchQuery.adult} Adults` : `${searchQuery.adult} Adult` }}</span>
      <span
        class="text-muted d-block"
        v-if="searchQuery.child > 0"
      >{{ searchQuery.child > 1 ? `${searchQuery.child} Children` : `${searchQuery.child} Child` }}</span>
    </b-list-group-item>

    <b-list-group-item class="d-flex justify-content-between py-1 tiket-price">
      <span class="text-muted mb-1 d-block">Ticket Price(s)</span>
      <span>{{ summaryTrip.ticketPrice | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="departSchedule.Price.DepartTerminalFee"
      class="d-flex justify-content-between py-1 depart-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Departure Terminal Fee(s)</span>
      <span>{{ departSchedule.Price.DepartTerminalFee ? departSchedule.Price.NewDepartTerminalFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.NewReturnTerminalFee"
      class="d-flex justify-content-between py-1 return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Return Terminal Fee(s)</span>
      <span>{{ returnSchedule.Price.NewReturnTerminalFee * searchQuery.TotalPax | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="insurance"
      class="d-flex justify-content-between py-1 return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Travel Insurance</span>
      <span>{{ insurance > 1 ? `${insurance} passengers` : `${insurance} passenger` }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.THKTaxFee > 0"
      class="d-flex justify-content-between py-1 return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Tax</span>
      <span>{{ returnSchedule.Price.THKTaxFee > 0 ? returnSchedule.Price.THKTaxFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.BookingFee > 0"
      class="d-flex justify-content-between py-1 return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Confirmation Fee</span>
      <span>{{ returnSchedule.Price.BookingFee > 0 ? returnSchedule.Price.BookingFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="clearance === true"
      class="d-flex justify-content-between py-1 return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Clearance Express</span>
      <span>{{ 10 * searchQuery.TotalPax | currency }}</span>
    </b-list-group-item>

    <b-list-group-item class="mt-3 py-1 border-bottom depart-trip text-center">
      <h5 class="text-muted mb-1 d-block">Depart Trip</h5>
      <span class="d-block">{{ $moment(searchQuery.TravelDate).format("ddd, DD MMM YYYY") }}</span>
      <span
        class="d-block"
      >{{ departSchedule.TravelTime ? `${departSchedule.TravelTime}` : "" }} ({{ timezone(searchQuery.JourneyName) }}) {{ searchQuery.JourneyName }}</span>
      <div v-if="searchQuery.JourneyType === 2">
        <hr />
        <h5 class="text-muted mb-1 d-block">Return Trip</h5>
        <span class="d-block">{{ $moment(searchQuery.ReturnTravelDate).format("ddd, DD MMM YYYY") }}</span>
        <span
          class="d-block"
        >{{ returnSchedule.ReturnTravelTime ? `${returnSchedule.ReturnTravelTime}` : "" }} ({{ timezone(searchQuery.ReturnJourneyName) }}) {{ searchQuery.ReturnJourneyName }}</span>
      </div>
    </b-list-group-item>

    <b-list-group-item class="d-flex justify-content-between py-3 return-terminal-fee">
      <strong class="text-muted mb-1 d-block">Total:</strong>
      <h4 class="mb-0">{{ totalAmount | currency }}</h4>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "TripSummary",
  computed: {
    ...mapState({
      journey: state => state.ferryDestinations,
      searchQuery: state => state.searchQuery,
      departSchedule: state => state.selectedDeparture,
      returnSchedule: state => state.selectedReturn,
      clearance: state => state.expressClearance,
      summaryTrip: state => state.bookings,
      currentUser: state => state.currentUser,
      totalAmount: state => state.totalAmount
    }),
    ...mapGetters(["insurance"]),
    totalAmount() {
      var sum = 0;
      const totalDues = {
        currentTotal: this.summaryTrip.totalAmount,
        isInsurance: this.insurance > 0 ? this.insurance * 5 : 0,
        isExpress: this.clearance == true ? this.searchQuery.TotalPax * 10 : 0
      };

      for (var key in totalDues) {
        if (totalDues.hasOwnProperty(key)) {
          sum += parseFloat(totalDues[key]);
        }
      }

      return sum;
    },
    noTerminalFees() {
      var show = false;
      if (
        this.searchQuery.JourneyName === "HarbourFront to Tanjung Balai" &&
        this.searchQuery.ReturnJourneyName === "Tanjung Balai to HarbourFront"
      ) {
        show = true;
        return `No Terminal Fee Charge for ${this.searchQuery.JourneyName} & ${this.searchQuery.ReturnJourneyName} Trip`;
      }
      return show;
    }
  },
  methods: {
    timezone(val) {
      if (!val) return;
      const journey = this.journey.find(item => item.JourneyName === val);
      return journey.DepartCountry === "SINGAPORE" ? "SG" : "ID";
    },
    updateTotalAmount(amount) {
      this.$store.commit("SET_TOTAL_AMOUNT", amount);
    }
  },
  watch: {
    totalAmount: {
      deep: true,
      handler: "updateTotalAmount"
    }
  }
};
</script>

<style>
</style>