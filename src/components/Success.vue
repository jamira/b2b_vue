<template>
  <b-row>
    <b-col xl="6" md="12">
      <b-card class="shadow mb-4" header="Booking Details" header-tag="div">
        <b-list-group v-for="(booking, key) in bookingDetails" :key="key">
          <b-list-group-item class="d-flex justify-content-between py-2 border-bottom tiket-price">
            <span class="text-muted mb-1 d-block">Booking Name</span>
            <span>{{ booking.BookingName }}</span>
          </b-list-group-item>

          <b-list-group-item
            class="d-flex justify-content-between py-2 border-bottom return-terminal-fee"
          >
            <span class="text-muted mb-1 d-block">Booking Code</span>
            <span>{{ booking.BookingCode }}</span>
          </b-list-group-item>

          <b-list-group-item class="py-2 border-bottom depart-trip">
            <div class="float-left">
              <strong class="text-muted mb-2 d-block">Depart Trip</strong>
              <span class="d-block">
                {{ $moment(booking.TravelDate).format("ddd, DD MMMM YYYY") }}
                <strong>{{ booking.TravelTime}}</strong>
              </span>
              <span class="d-block">{{ booking.JourneyCode}}</span>
            </div>

            <div class="float-right" v-if="booking.JourneyType === '2'">
              <span class="text-muted mb-2 d-block">Return Trip</span>
              <span class="d-block" v-if="booking.ReturnTravelDate">
                {{ $moment(booking.ReturnTravelDate).format("ddd, DD MMMM YYYY") }}
                <span
                  v-if="booking.ReturnTravelTime"
                >{{ booking.ReturnTravelTime}}</span>
              </span>
              <span class="d-block" v-if="booking.ReturnJourneyCode">{{ booking.ReturnJourneyCode}}</span>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-col>
    <b-col xl="6" md="12">
      <b-card class="shadow mb-4" header="Passenger Details" header-tag="div">
        <ol class="py-0" v-if="booking.PassengerList.length">
          <li v-for="(passenger, key) in booking.PassengerList" :key="key">{{ passenger }}</li>
        </ol>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Passenger",
  computed: {
    ...mapGetters(["bookingDetails"])
  }
};
</script>

<style>
</style>