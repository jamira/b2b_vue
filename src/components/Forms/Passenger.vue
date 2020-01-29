<template>
  <b-row>
    <b-col xl="8" md="12">
      <b-form @submit.prevent="onSubmit">
        <b-card class="shadow mb-4" header="Booking Information" header-tag="div">
          <b-form-row>
            <b-col xl="4" md="12">
              <b-form-group
                id="booking-name"
                label="Booking Name"
                label-for="booking-name"
                label-size="sm"
              >
                <b-form-input id="input-1" v-model="bookingName" trim></b-form-input>
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-card>

        <b-card
          class="shadow mb-4 passenger-devider pb-2"
          header="Passenger Details"
          header-tag="div"
          v-for="(booking, index) in $v.bookings.$each.$iter"
          :key="index"
        >
          <b-form-row>
            <b-col xl="4" md="12">
              <b-form-group label="Passport Name" label-size="sm">
                <b-form-input
                  type="text"
                  v-model="booking.passportName.$model"
                  :name="'passenger_name_' + index"
                  :id="'passenger_name_' + index"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="!booking.passportName.required"
                >Please state your passport name</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col xl="4" md="12">
              <b-form-group label="Passport No" label-size="sm">
                <b-form-input
                  type="text"
                  v-model="booking.passportNo.$model"
                  :name="'passenger_no_' + index"
                  :id="'passenger_no_' + index"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="!booking.passportNo.required"
                >Please state your passport name</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col xl="4" md="12">
              <b-form-group label="Nationality" label-size="sm">
                <b-form-select v-model="booking.nationality.$model" :options="countries"></b-form-select>
                <b-form-invalid-feedback
                  v-if="!booking.nationality.required"
                >Please state your passport name</b-form-invalid-feedback>
                {{ booking.nationality.$model }}
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col xl="4" md="12">
              <b-form-group label="Birthdate" label-size="sm">
                <date-picker
                  v-model="booking.birthdate.$model"
                  input-class="form-control"
                  placeholder="Select date"
                  format="D MMMM YYYY"
                ></date-picker>
                <b-form-invalid-feedback
                  v-if="!booking.birthdate.required"
                >Please state your passport name</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col xl="4" md="12">
              <b-form-group label="Passport Issue Date" label-size="sm">
                <date-picker
                  v-model="booking.dateIssue.$model"
                  input-class="form-control"
                  placeholder="Select date"
                  format="D MMMM YYYY"
                ></date-picker>
              </b-form-group>
            </b-col>

            <b-col xl="4" md="12">
              <b-form-group label="Passport Expiry Date" label-size="sm">
                <date-picker
                  v-model="booking.expiryDate.$model"
                  :disabled-date="notBeforeToday"
                  input-class="form-control"
                  placeholder="Select date"
                  format="D MMMM YYYY"
                ></date-picker>
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-form-group
              label="Travel Insurance"
              label-size="sm"
              description="Travel Insurance is now made available to you at only 5$ per person. It protects you for travel to Batam Island for up to 3 days"
            >
              <b-form-radio-group
                :name="'passenger_insurance_' + index"
                v-model="booking.travelInsurance.$model"
                :options="insuranceOptions"
                stacked
                @change="onChange($event, booking, index)"
                size="sm"
              ></b-form-radio-group>
            </b-form-group>
          </b-form-row>
        </b-card>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-col>
    <b-col xl="4" md="12">
      <b-card class="shadow mb-4" header="Optional Add-on" header-tag="div">
        <b-form-group>
          <b-form-checkbox @change="onChckClerance($event)" switch size="sm">Express Clearance</b-form-checkbox>
        </b-form-group>
      </b-card>

      <b-card class="shadow mb-4" header="Trip Summary" header-tag="div">
        <TripSummary />
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import DatePicker from "vue2-datepicker";
import TripSummary from "../TripSummary";
import { mapGetters } from "vuex";
const today = new Date();
today.setHours(0, 0, 0, 0);
export default {
  name: "Passenger",
  components: {
    DatePicker,
    TripSummary
  },
  data() {
    return {
      bookingName: "",
      bookings: [
        {
          passportName: "",
          passportNo: "",
          nationality: "",
          expiryDate: "",
          dateIssue: "",
          birthdate: "",
          priceCode: "",
          travelInsurance: false
        }
      ],
      insuranceOptions: [
        {
          text: "Yes, add Travel Insurance for only 5$ per person",
          value: true
        },
        { text: "No, I do not require Travel Insurace", value: false }
      ]
    };
  },
  validations: {
    bookings: {
      $each: {
        passportNo: { required },
        passportName: { required },
        nationality: { required },
        expiryDate: { required },
        dateIssue: { required },
        birthdate: { required },
        travelInsurance: { required }
      }
    }
  },
  computed: {
    ...mapGetters([
      "countries",
      "searchQuery",
      "loading",
      "departSchedule",
      "returnSchedule",
      "clearance",
      "insurance"
    ])
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      let bookings = this.createBooking();

      this.$store.dispatch("CREATE_BOOKING", bookings);
    },
    onChange(event, booking, key) {
      const data = {
        key: key,
        TravelInsurance: event,
        PassportName: booking.passportName.$model,
        PassportNo: booking.passportNo.$model
      };

      this.$store.commit("SET_HAS_INSURANCE", data);
    },
    createFields() {
      for (let step = 1; step < this.searchQuery.TotalPax; step++) {
        this.bookings.push({
          passportName: "",
          passportNo: "",
          nationality: "",
          expiryDate: "",
          dateIssue: "",
          birthdate: "",
          priceCode: "",
          travelInsurance: false
        });
      }
    },
    createBooking() {
      let passengers = [];
      for (let index = 0; index < this.bookings.length; index++) {
        const data = this.bookings[index];
        let formattedReturnValues = {
          PassportNo: data.passportNo,
          PassportName: data.passportName,
          BirthDate: this.$moment(data.birthdate).format("YYYY-MM-DD"),
          BirthPlace: null,
          Gender: null,
          Nationality: data.nationality,
          PassportExpiredDate: this.$moment(data.expiryDate).format(
            "YYYY-MM-DD"
          ),
          PassportIssueDate: this.$moment(data.dateIssue).format("YYYY-MM-DD"),
          PriceCode: this.departSchedule.Price.PriceCode
        };

        passengers.push(formattedReturnValues);
      }

      return {
        JourneyType: this.searchQuery.JourneyType,
        IsReturnOpenTicket: 0,
        DepartTripCode: this.departSchedule.DepartTripCode,
        DepartSeatCategory: this.departSchedule.DepartSeatCategory,
        TravelDate: this.departSchedule.TravelDate,
        ReturnTripCode: this.returnSchedule.ReturnTripCode
          ? this.returnSchedule.ReturnTripCode
          : "",
        ReturnSeatCategory: this.returnSchedule.ReturnSeatCategory
          ? this.returnSchedule.ReturnSeatCategory
          : "",
        ReturnTravelDate: this.returnSchedule.ReturnTravelDate
          ? this.returnSchedule.ReturnTravelDate
          : "",
        IncludeDepartTerminalFee: this.searchQuery.JourneyType === 2 ? 1 : 1,
        IncludeReturnTerminalFee: this.searchQuery.JourneyType === 2 ? 1 : 0,
        Passenger: passengers
      };
    },
    notBeforeToday(date) {
      return date < today;
    },
    onChckClerance(event) {
      this.$store.commit("SET_EXPRESS_CLEARANCE", event);
    },
    status(validation) {
      if (validation.$error) {
        return false;
      }
    }
  },
  created() {
    this.createFields();
    this.$store.dispatch("GET_COUNTRIES");
  }
};
</script>

<style>
</style>