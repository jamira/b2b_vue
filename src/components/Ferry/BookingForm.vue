<template>
  <b-form @submit.prevent="onSubmit">
    <b-row>
      <b-col xl="8" md="12">
        <b-card class="shadow mb-4" header="Booking Information" header-tag="div">
          <b-form-row>
            <b-col xl="4" md="12">
              <b-form-group
                id="booking-name"
                label="Booking Name"
                label-for="booking-name"
                label-size="sm"
              >
                <b-form-input v-model="$v.bookingName.$model" :class="status(bookingName)" trim></b-form-input>
                <b-form-invalid-feedback v-if="!bookingName.required">Please state booking name</b-form-invalid-feedback>
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
                  :class="status(booking.passportName)"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="!booking.passportName.required"
                >Please state passport name</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col xl="4" md="12">
              <b-form-group label="Passport No" label-size="sm">
                <b-form-input
                  type="text"
                  v-model="booking.passportNo.$model"
                  :name="'passenger_no_' + index"
                  :id="'passenger_no_' + index"
                  :class="status(booking.passportNo)"
                  trim
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="!booking.passportNo.required"
                >Please state passport no</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col xl="4" md="12">
              <b-form-group label="Nationality" label-size="sm">
                <b-form-select
                  v-model="booking.nationality.$model"
                  :options="countries"
                  :class="status(booking.nationality)"
                ></b-form-select>
                <b-form-invalid-feedback
                  v-if="!booking.nationality.required"
                >Please state nationality</b-form-invalid-feedback>
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
                  :class="status(booking.birthdate)"
                ></date-picker>
                <b-form-invalid-feedback v-if="!booking.birthdate.required">Please state birthdate</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col xl="4" md="12">
              <b-form-group label="Passport Issue Date" label-size="sm">
                <date-picker
                  v-model="booking.dateIssue.$model"
                  input-class="form-control"
                  placeholder="Select date"
                  format="D MMMM YYYY"
                  :class="status(booking.dateIssue)"
                ></date-picker>
                <b-form-invalid-feedback v-if="!booking.dateIssue.required">Please state issue date</b-form-invalid-feedback>
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
                  :class="status(booking.expiryDate)"
                ></date-picker>
                <b-form-invalid-feedback
                  v-if="!booking.expiryDate.required"
                >Please state expiry date</b-form-invalid-feedback>
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
      </b-col>
      <b-col xl="4" md="12">
        <b-card
          class="shadow mb-4"
          header="Optional Add-on"
          header-tag="div"
          v-if="isExpressClearance"
        >
          <b-form-group>
            <b-form-checkbox @change="onChckClerance($event)" switch size="sm">Express Clearance</b-form-checkbox>
          </b-form-group>
        </b-card>

        <b-card class="shadow mb-4" header="Trip Summary" header-tag="div">
          <TripSummary />
          <b-button type="submit" variant="primary" block>Create Booking</b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import DatePicker from "vue2-datepicker";
import TripSummary from "../TripSummary";
import { mapGetters, mapState } from "vuex";
import countries from "../../assets/countries.json";
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
    bookingName: {
      required
    },
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
    ...mapState({
      searchQuery: state => state.searchQuery,
      departSchedule: state => state.selectedDeparture,
      returnSchedule: state => state.selectedReturn,
      clearance: state => state.expressClearance,
      bookingDetails: state => state.bookingDetails,
      currentUser: state => state.currentUser,
      totalAmount: state => state.totalAmount,
      travelInsurance: state => state.travelInsurance
    }),
    ...mapGetters(["insurance"]),
    countries() {
      return countries.map(country => {
        return {
          value: country.nationality,
          text: country.en_short_name
        };
      });
    },
    checkBooking() {
      var status = "";
      for (let index = 0; index < this.bookingDetails.length; index++) {
        const dataElement = this.bookingDetails[index];
        if (dataElement.Status === "Error") {
          status = dataElement.Message;
        } else {
          status = true;
        }
      }
      return status;
    },
    checkBalance() {
      let access = false;
      let currentUser = this.$session.get("currentUser");
      if (currentUser.account_balance > this.totalAmount) {
        access = true;
        let balance = currentUser.account_balance - this.totalAmount;
        this.$session.set("updatedBalance", balance);
      }

      return access;
    },
    isExpressClearance() {
      var show = true;
      if (
        this.searchQuery.JourneyName === "HarbourFront to Tanjung Balai" &&
        this.searchQuery.ReturnJourneyName === "Tanjung Balai to HarbourFront"
      ) {
        show = false;
      }
      return show;
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();

      if (!this.$v.bookings.$error) {
        let bookings = this.createBooking();

        for (let index = 0; index < bookings.Passenger.length; index++) {
          const field = bookings.Passenger[index];
          if (field.PassportIssueDate < field.BirthDate) {
            this.$alert({
              title: "THK Message",
              content: `Birthdate shouldn't be less than on passport issue date.`
            });

            return;
          }
        }

        //check if current user has sufficient balance
        if (this.checkBalance == 1) {
          this.$store.dispatch("CREATE_BOOKING", bookings);
        }
      }
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
          PriceCode: this.departSchedule.Price.PriceCode,
          TravelInsurance: data.travelInsurance,
          ExpressClearance: this.clearance
        };

        passengers.push(formattedReturnValues);
      }

      //mutate passengers
      this.$store.commit("SET_PASSENGERS", passengers);

      // update total amount if add on was set

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
      return validation.$error
        ? "is-invalid"
        : validation.$dirty
        ? "is-valid"
        : "";
    }
  },
  created() {
    this.createFields();
  },
  watch: {
    checkBooking(status) {
      if (status === true) {
        this.$router.push({
          path: "booking",
          query: { status: "success" }
        });
      } else {
        this.$alert({
          title: "THK Message",
          content: status
        });
      }
    }
  }
};
</script>

<style>
</style>