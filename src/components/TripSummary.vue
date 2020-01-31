<template>
  <b-list-group>
    <b-list-group-item class="py-2 border-bottom">
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

    <b-list-group-item class="d-flex justify-content-between py-2 border-bottom tiket-price">
      <span class="text-muted mb-1 d-block">Ticket Price(s)</span>
      <span>{{ ticketPrice | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="departSchedule.Price.DepartTerminalFee"
      class="d-flex justify-content-between py-2 border-bottom depart-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Departure Terminal Fee(s)</span>
      <span>{{ departSchedule.Price.DepartTerminalFee ? departSchedule.Price.NewDepartTerminalFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.NewReturnTerminalFee"
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Return Terminal Fee(s)</span>
      <span>{{ returnSchedule.Price.NewReturnTerminalFee * searchQuery.TotalPax | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="travelInsurance"
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Travel Insurance</span>
      <span>{{ travelInsurance > 1 ? `${travelInsurance} passengers` : `${travelInsurance} passenger` }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.THKTaxFee > 0"
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Tax</span>
      <span>{{ returnSchedule.Price.THKTaxFee > 0 ? returnSchedule.Price.THKTaxFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="searchQuery.JourneyType === 2 && returnSchedule.Price.BookingFee > 0"
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Confirmation Fee</span>
      <span>{{ returnSchedule.Price.BookingFee > 0 ? returnSchedule.Price.BookingFee * searchQuery.TotalPax : 0 | currency }}</span>
    </b-list-group-item>

    <b-list-group-item
      v-if="clearance === true"
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <span class="text-muted mb-1 d-block">Clearance Express</span>
      <span>{{ clearanceFee * searchQuery.TotalPax | currency }}</span>
    </b-list-group-item>

    <b-list-group-item class="py-2 border-bottom depart-trip text-center">
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

    <b-list-group-item
      class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
    >
      <strong class="text-muted mb-1 d-block">Total Fare:</strong>
      <h4 class="mb-0">{{ totalFare | currency }}</h4>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TripSummary",
  data() {
    return {
      clearanceFee: 10
    };
  },
  computed: {
    ...mapGetters([
      "searchQuery",
      "loading",
      "clearance",
      "departSchedule",
      "returnSchedule",
      "insurance",
      "travelDestinations"
    ]),
    travelInsurance() {
      const chkTrue = this.insurance.filter(
        item => item.TravelInsurance === true
      );
      return chkTrue.length;
    },
    ticketPrice() {
      var sum = 0;
      var ticket = {};

      if (
        this.searchQuery.JourneyName === "HarbourFront to Tanjung Balai" &&
        this.searchQuery.JourneyReturnName === "Tanjung Balai to HarbourFront"
      ) {
        ticket = {
          departurePriceAdult:
            this.searchQuery.adult > 0
              ? parseFloat(this.departSchedule.Price.NewPrice) *
                this.searchQuery.adult
              : 0,
          departurePriceChild:
            this.searchQuery.child > 0
              ? parseFloat(this.departSchedule.Price.NewPriceChild) *
                this.searchQuery.child
              : 0,
          returnPriceAdult:
            this.searchQuery.adult > 0
              ? parseFloat(this.returnSchedule.Price.NewPrice) *
                this.searchQuery.adult
              : 0,
          returnPriceChild:
            this.searchQuery.child > 0
              ? parseFloat(this.returnSchedule.Price.NewPriceChild) *
                this.searchQuery.child
              : 0
        };
      } else {
        if (this.searchQuery.JourneyType === 1) {
          ticket = {
            departurePrice:
              parseFloat(this.departSchedule.Price.NewPrice) *
              this.searchQuery.TotalPax
          };
        } else if (this.searchQuery.JourneyType === 2) {
          ticket = {
            departurePrice:
              parseFloat(this.departSchedule.Price.NewPrice) *
              this.searchQuery.TotalPax,
            returnPrice:
              parseFloat(this.returnSchedule.Price.NewPrice) *
              this.searchQuery.TotalPax
          };
        }
      }

      for (var key in ticket) {
        if (ticket.hasOwnProperty(key)) {
          sum += parseFloat(ticket[key]);
        }
      }

      return sum;
    },
    totalFare() {
      var sum = 0;
      var fare = {};

      if (this.searchQuery.JourneyType === 1) {
        fare = {
          totalTicketPrice: this.ticketPrice,
          departTerminalFee:
            this.departSchedule.Price.NewDepartTerminalFee *
            this.searchQuery.TotalPax,
          travelInsurance:
            this.travelInsurance > 0 ? this.travelInsurance * 5 : 0,
          expressClearance:
            this.clearance === true
              ? this.clearanceFee * this.searchQuery.TotalPax
              : 0
        };
      } else if (this.searchQuery.JourneyType === 2) {
        fare = {
          totalTicketPrice: this.ticketPrice,
          departTerminalFee:
            this.departSchedule.Price.NewDepartTerminalFee *
            this.searchQuery.TotalPax,
          returnTerminalFee:
            this.searchQuery.JourneyType === 2 &&
            this.returnSchedule.Price.NewPrice > 0
              ? this.returnSchedule.Price.NewReturnTerminalFee *
                this.searchQuery.TotalPax
              : 0,
          travelTax:
            this.returnSchedule.Price.JourneyType === "2"
              ? this.returnSchedule.Price.THKTaxFee * this.searchQuery.TotalPax
              : 0,
          bookingFee: this.returnSchedule.Price.BookingFee
            ? this.returnSchedule.Price.BookingFee * this.searchQuery.TotalPax
            : 0,
          travelInsurance:
            this.travelInsurance > 0 ? this.travelInsurance * 5 : 0,
          expressClearance:
            this.clearance === true
              ? this.clearanceFee * this.searchQuery.TotalPax
              : 0
        };
      } else {
        return;
      }

      for (var key in fare) {
        if (fare.hasOwnProperty(key)) {
          sum += parseFloat(fare[key]);
        }
      }

      return sum;
    }
  },
  methods: {
    timezone(val) {
      if (!val) return;
      const journey = this.travelDestinations.find(
        item => item.JourneyName === val
      );
      return journey.DepartCountry === "SINGAPORE" ? "SG" : "ID";
    }
  }
};
</script>

<style>
</style>