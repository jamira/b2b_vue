<template>
  <b-card class="shadow mb-4" header="Schedule Availability Information" header-tag="div">
    <b-form @submit.prevent="onSubmit">
      <b-alert variant="danger" fade :show="showAlert">
        <ul class="list-unstyled mb-0">
          <li v-for="(error, key) in message" :key="key">{{ error }}</li>
        </ul>
      </b-alert>
      <b-form-row>
        <b-col class="mb-2">
          <b-form-group label="Choose Journey Type">
            <b-form-radio-group v-model="selectedWay" :options="journeyOptions" name="journey-type"></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col xl="3" md="12">
          <b-form-group id="departure-port" label="Departure Port" label-for="departure-port">
            <b-form-select
              v-model="$v.selectedDeparture.port.$model"
              :class="status($v.selectedDeparture.port)"
            >
              >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>-- Select departure trip --</b-form-select-option>
              </template>
              <b-form-select-option-group
                v-for="(group, key) in formattedDepaturePort"
                :label="group.label"
                :key="key"
              >
                <b-form-select-option
                  v-for="(departure, key) in group.departure"
                  :key="key"
                  :label="departure.text"
                  :value="departure"
                ></b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-invalid-feedback
              v-if="!$v.selectedDeparture.port.required"
            >Please choose depature port</b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col xl="3" md="12" v-show="selectedWay === 'roundtrip'">
          <b-form-group id="return-port" label="Return Port" label-for="return-port">
            <b-form-select
              v-model="$v.selectedReturn.port.$model"
              :class="status($v.selectedReturn.port)"
            >
              <template v-slot:first>
                <b-form-select-option :value="null">-- Select return trip --</b-form-select-option>
              </template>
              <b-form-select-option-group
                v-for="(group, key) in formatttedReturnPort"
                :label="key"
                :key="key"
              >
                <b-form-select-option
                  v-for="(returnPort, key) in group"
                  :key="key"
                  :label="returnPort.JourneyName"
                  :value="returnPort"
                ></b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-invalid-feedback
              v-if="!$v.selectedReturn.port.required"
            >Please choose return port</b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col xl="2" md="12">
          <b-form-group id="departure-date" label="Travel Date" label-for="departure-date">
            <date-picker
              v-model="selectedDeparture.date"
              :disabled-date="notBeforeToday"
              input-class="form-control"
              format="D MMMM YYYY"
            ></date-picker>
          </b-form-group>
        </b-col>
        <b-col xl="2" md="12" v-show="selectedWay === 'roundtrip'">
          <b-form-group id="return-date" label="Return Date" label-for="return-date">
            <date-picker
              v-model="selectedReturn.date"
              :disabled-date="notBeforeToday"
              input-class="form-control"
              format="D MMMM YYYY"
            ></date-picker>
          </b-form-group>
        </b-col>
        <b-col xl="1" md="12">
          <b-form-group id="adult" label="Adult" label-for="adult">
            <b-form-select v-model="totalPax.adult">
              <b-form-select-option v-for="n in 15" :key="n" :value="n">{{ n }}</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col xl="1" md="12">
          <b-form-group id="child" label="Child" label-for="child">
            <b-form-select v-model="totalPax.child">
              <b-form-select-option v-for="n in 15" :key="n" :value="n">{{ n }}</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-button type="submit" variant="primary">
        <span class="my-1">Search</span>
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import DatePicker from "vue2-datepicker";
import { required } from "vuelidate/lib/validators";
const today = new Date();
today.setHours(0, 0, 0, 0);
export default {
  name: "FerrySearchForm",
  components: { DatePicker },
  data() {
    return {
      isLoading: false,
      isOneWay: false,
      selectedWay: "roundtrip",
      journeyOptions: [
        {
          text: "One Way",
          value: "oneway"
        },
        {
          text: "Round Trip",
          value: "roundtrip"
        }
      ],
      selectedDeparture: {
        port: null,
        date: new Date()
      },
      selectedReturn: {
        port: null,
        date: new Date()
      },
      totalPax: {
        adult: 1,
        child: 0
      },
      returnPort: [],
      pairKey: null,
      message: []
    };
  },
  validations() {
    if (this.isOneWay == true) {
      return {
        selectedDeparture: {
          port: { required }
        }
      };
    } else {
      return {
        selectedDeparture: {
          port: { required }
        },
        selectedReturn: {
          port: { required }
        }
      };
    }
  },
  computed: {
    ...mapGetters(["travelDestinations", "searchQuery"]), // get the from API/Store
    formattedDepaturePort() {
      // refine data from API/Store
      var groups = {};
      for (let index = 0; index < this.travelDestinations.length; index++) {
        const groupCountry = this.travelDestinations[index].DepartCountry;
        if (!groups[groupCountry]) {
          groups[groupCountry] = [];
        }

        groups[groupCountry].push({
          text: this.travelDestinations[index].JourneyName,
          ArrivalPort: this.travelDestinations[index].ArrivalPort,
          ArrivalPortName: this.travelDestinations[index].ArrivalPortName,
          DepartCountry: this.travelDestinations[index].DepartCountry,
          DepartPort: this.travelDestinations[index].DepartPort,
          DepartPortName: this.travelDestinations[index].DepartPortName,
          Duration: this.travelDestinations[index].Duration,
          JourneyCode: this.travelDestinations[index].JourneyCode,
          JourneyName: this.travelDestinations[index].JourneyName,
          PairKey: this.travelDestinations[index].PairKey
        });
      }

      const myArray = [];
      for (const key in groups) {
        if (groups.hasOwnProperty(key)) {
          myArray.push({
            label: key,
            departure: groups[key]
          });
        }
      }

      return myArray;
    },
    formatttedReturnPort() {
      // refine data from Return Port
      const refArray = this.returnPort;

      const filteredReturnJourney = refArray.filter(item => {
        return item.PairKey === this.pairKey;
      });

      return filteredReturnJourney.reduce((country, items) => {
        country[items.DepartCountry] = [
          ...(country[items.DepartCountry] || []),
          items
        ];
        return country;
      }, {});
    },
    formattedReturnDate: {
      get() {
        return this.selectedDeparture.date;
      },
      set(newVal) {
        return (this.selectedReturn.date = newVal);
      }
    },
    showAlert() {
      return this.message.length > 0 ? true : false;
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      this.getFerryQuery();
    },
    arrivalPort(departureCountry) {
      // get return country base on the selected departure country
      const found = this.travelDestinations.filter(
        item => item.DepartCountry != departureCountry
      );
      found ? (this.returnPort = found) : [];
    },
    notBeforeToday(date) {
      return date < today;
    },
    status(validation) {
      // check if state is empty
      return validation.$error ? "is-invalid" : validation.$dirty ? "" : "";
    },
    getFerryQuery() {
      this.message = [];
      const queryString = {
        TotalPax: parseInt(this.totalPax.adult + this.totalPax.child),
        JourneyType: this.selectedWay === "oneway" ? 1 : 2,
        IsReturnOpenTicket: 0,
        DepartPort: this.selectedDeparture.port.DepartPort,
        ArrivalPort: this.selectedDeparture.port.ArrivalPort,
        TravelDate: this.$moment(this.selectedDeparture.date).format(
          "YYYY-MM-DD"
        ),
        ReturnDepartPort:
          this.selectedWay === "oneway"
            ? ""
            : this.selectedReturn.port.DepartPort,
        ReturnArrivalPort:
          this.selectedWay === "oneway"
            ? ""
            : this.selectedReturn.port.ArrivalPort,
        ReturnTravelDate:
          this.selectedWay === "oneway"
            ? ""
            : this.$moment(this.selectedReturn.date).format("YYYY-MM-DD"),
        adult: this.totalPax.adult ? this.totalPax.adult : 1,
        child: this.totalPax.child ? this.totalPax.child : 0,
        JourneyName: this.selectedDeparture.port.JourneyName,
        ReturnJourneyName:
          this.selectedWay === "oneway"
            ? ""
            : this.selectedReturn.port.JourneyName
      };

      // mutate the query state, after query submitted
      this.$store.commit("SET_SEARCH_QUERY", queryString);

      // return nothing if these destination were selected by one way
      if (this.searchQuery.JourneyType === 1) {
        if (
          this.searchQuery.JourneyName === "Tanah Merah to Tanjung Pinang" ||
          this.searchQuery.JourneyName === "HarbourFront to Tanjung Balai" ||
          this.searchQuery.JourneyName === "Tanjung Pinang to Tanah Merah" ||
          this.searchQuery.JourneyName === "Tanjung Balai to HarbourFront"
        ) {
          this.message.push(
            "Sorry, we don't have 1 way travel schedule for " +
              this.searchQuery.JourneyName
          );
          return;
        }
      } else if (this.searchQuery.JourneyType === 2) {
        if (
          this.$moment(this.selectedDeparture.date).format("YYYY-MM-DD") >
          this.$moment(this.selectedReturn.date).format("YYYY-MM-DD")
        ) {
          this.message.push(
            "Travel date shouldn't be greater than return date."
          );
        }
      } else {
        return;
      }

      // dispatch state to get the current price and schedule for ferry
      this.$store.dispatch("GET_SCHEDULE_PRICE", queryString);
    }
  },
  watch: {
    // watch object value whatever selected state and pipe put to arrivalPort fn, to get the opposite country
    selectedDeparture: {
      handler(val) {
        this.arrivalPort(val.port.DepartCountry);
        this.pairKey = val.port.PairKey;
      },
      deep: true
    }
  }
};
</script>

<style>
</style>