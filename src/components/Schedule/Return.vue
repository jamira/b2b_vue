<template>
  <b-list-group>
    <b-list-group-item
      v-for="(data, key) in schedule"
      :key="key"
      button
      :active="key === isActive"
      @click="onSubmit(key, data)"
      class="d-flex justify-content-between py-3 border-bottom"
    >
      <div>
        <strong
          class="d-block text-center"
        >{{ data.TravelTime }} ({{ timezone(searchQuery.ReturnJourneyName) }})</strong>
        <span class="d-block">{{ data.JourneyCode }}</span>
      </div>
      <div v-if="price">
        <span class="d-block text-center">Adult</span>
        <span class="d-block">{{ price[0].NewPrice | currency}}</span>
      </div>
      <div v-if="price[0].NewPriceChild">
        <span class="d-block text-center">Child</span>
        <span class="d-block">{{ price[0].NewPriceChild | currency }}</span>
      </div>
      <span class="d-block text-center">
        Cabin Class
        <br />
        {{ data.SeatCategory }}
      </span>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "DepartSchedule",
  props: ["schedule", "price"],
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    onSubmit(key, schedule) {
      this.isActive = key;
      const selectedReturn = {
        ReturnTripCode: schedule.TripCode,
        ReturnSeatCategory: schedule.SeatCategory,
        ReturnTravelDate: schedule.TravelDate,
        ReturnTravelTime: schedule.TravelTime,
        Price: this.price[0]
      };
      this.$store.commit("SET_SELECTED_RETURN_SCHEDULE", selectedReturn);
    },
    timezone(val) {
      if (!val) return;
      const journey = this.travelDestinations.find(
        item => item.JourneyName === val
      );
      return journey.DepartCountry === "INDONESIA" ? "ID" : "SG";
    }
  },
  computed: {
    ...mapGetters(["travelDestinations", "searchQuery"])
  }
};
</script>

<style>
</style>