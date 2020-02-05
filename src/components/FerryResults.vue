<template>
  <div class="search-result-wrap">
    <b-row v-for="(schedule, key) in schedules" :key="key" class="clearfix">
      <b-col :xl="searchQuery.JourneyType === 1 ? 10 : 5" md="12">
        <b-card class="shadow mb-4" header-tag="div" no-body>
          <template v-slot:header>
            <b-link v-b-toggle="'depature_result'">
              <h6 class="m-0">Depature - {{ searchQuery.JourneyName }}</h6>
            </b-link>
          </template>
          <b-collapse id="depature_result" accordion="my-departure-result" role="tabpanel" visible>
            <b-card-body>
              <DepartSchedule
                v-if="schedule.DepartTrips.length > 1"
                :schedule="schedule.DepartTrips"
                :price="schedule.Price"
              />
              <b-alert
                v-else
                show
                variant="warning"
              >No schedule available for {{ searchQuery.JourneyName }}</b-alert>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
      <b-col xl="5" md="12" v-show="searchQuery.JourneyType === 2">
        <b-card class="shadow mb-4" header-tag="div" no-body>
          <template v-slot:header>
            <b-link v-b-toggle="'return_result'">
              <h6 class="m-0">Return - {{ searchQuery.ReturnJourneyName }}</h6>
            </b-link>
          </template>
          <b-collapse id="return_result" accordion="my-return-result" role="tabpanel" visible>
            <b-card-body>
              <ReturnSchedule
                v-if="schedule.ReturnTrips.length > 1"
                :schedule="schedule.ReturnTrips"
                :price="schedule.Price"
              />
              <b-alert
                v-else
                show
                variant="warning"
              >No schedule available for {{ searchQuery.JourneyName }}</b-alert>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
      <b-col xl="2" md="12">
        <b-button variant="secondary" @click="booking" :disabled="isDisabled" block>Create Booking</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DepartSchedule from "./Schedule/Departure";
import ReturnSchedule from "./Schedule/Return";
export default {
  name: "FerryResults",
  components: {
    DepartSchedule,
    ReturnSchedule
  },
  computed: {
    ...mapState({
      bookingDetail: state => state.reservationById,
      schedules: state => state.schedule,
      searchQuery: state => state.searchQuery,
      departSchedule: state => state.selectedDeparture,
      returnSchedule: state => state.selectedReturn
    }),
    isDisabled() {
      var state = false;
      const chkDepartObj = this.isEmpty(this.departSchedule);
      const chkReturnObj = this.isEmpty(this.returnSchedule);
      let journeyType = this.searchQuery.JourneyType;

      if (journeyType == 1) {
        if (chkDepartObj == true) {
          state = true;
        } else {
          state = false;
        }
      } else if (journeyType == 2) {
        if (chkDepartObj != false || chkReturnObj != false) {
          state = true;
        } else {
          state = false;
        }
      } else {
        return;
      }

      return state;
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
            this.searchQuery.TotalPax
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
    booking() {
      //set bookings
      let bookingDetails = {
        journeyType: this.searchQuery.JourneyType,
        travelDate: this.departSchedule.TravelDate,
        travelTime: this.departSchedule.TravelTime,
        returnTravelDate:
          this.searchQuery.JourneyType === 2
            ? this.returnSchedule.ReturnTravelDate
            : "",
        returnTrvelTime:
          this.searchQuery.JourneyType === 2
            ? this.returnSchedule.ReturnTravelTime
            : "",
        journeyName: this.searchQuery.JourneyName,
        returnJourneyName:
          this.searchQuery.JourneyType === 2
            ? this.searchQuery.ReturnJourneyName
            : "",
        totalPax: this.searchQuery.TotalPax,
        adult: this.searchQuery.adult,
        child: this.searchQuery.child,
        ticketPrice: this.ticketPrice,
        totalAmount: this.totalFare
      };

      this.$store.commit("SET_BOOKING", bookingDetails);
      this.$router.push({ path: "booking", query: { create: "ferry" } });
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style>
</style>
