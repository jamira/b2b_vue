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
import { mapGetters } from "vuex";
import DepartSchedule from "./Schedule/Departure";
import ReturnSchedule from "./Schedule/Return";
export default {
  name: "FerryResults",
  components: {
    DepartSchedule,
    ReturnSchedule
  },
  computed: {
    ...mapGetters([
      "schedules",
      "searchQuery",
      "loading",
      "departSchedule",
      "returnSchedule"
    ]),
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
    }
  },
  methods: {
    booking() {
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
