<template>
  <div id="add-credit">
    <b-card class="shadow mb-4" header="Add Credit" header-tag="div">
      <b-form @submit.prevent="onSubmit">
        <b-form-row>
          <b-col xl="3" md="12" class="mb-2">
            <b-form-group label="Amount">
              <b-form-input
                id="amount"
                v-model="$v.credit.amount.$model"
                placeholder="0"
                :class="status($v.credit.amount)"
                trim
              ></b-form-input>
              <b-form-invalid-feedback v-if="!credit.amount.minValue">Please enter amount</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col xl="4" md="12" class="mb-2">
            <b-form-group label="Method">
              <b-form-select
                v-model="$v.credit.method.$model"
                :options="methodOptions"
                :class="status($v.credit.method)"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
                </template>
              </b-form-select>
              <!-- <b-form-invalid-feedback v-if="!credit.method.required">Please select option method</b-form-invalid-feedback> -->
            </b-form-group>
          </b-col>

          <b-col xl="3" md="12" class="mb-2">
            <b-form-group label="Date">
              <date-picker
                v-model="$v.credit.date.$model"
                :disabled-date="notBeforeToday"
                inputClass="form-control"
                :class="status($v.credit.date)"
                placeholder="Select date"
                format="D MMMM YYYY"
              ></date-picker>
              <b-form-invalid-feedback v-if="!credit.date.required">Please select date of deposit</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col xl="2" md="12" class="mb-2">
            <b-form-group label="Time">
              <date-picker
                v-model="$v.credit.time.$model"
                :class="status($v.credit.time)"
                value-type="format"
                type="time"
                :open.sync="open"
                input-class="form-control"
                placeholder="Select time"
                @change="handleChange"
              ></date-picker>
              <b-form-invalid-feedback v-if="!credit.time.required">Please select time of deposit</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col class="mb-4">
            <b-form-textarea
              id="remark"
              v-model="credit.remark"
              placeholder="Additional note..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-col>
        </b-form-row>

        <!-- <b-form-row>
          <b-col md="4" class="mb-4">
            <b-form-file
              v-model="$v.credit.file.$model"
              placeholder="Top up proof of payment receipt..."
              drop-placeholder="Drop file here..."
              :class="status($v.credit.file)"
            ></b-form-file>
            <b-form-invalid-feedback v-if="!credit.file.required">Please provide proof of deposit</b-form-invalid-feedback>
          </b-col>
        </b-form-row>-->
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import DatePicker from "vue2-datepicker";
const today = new Date();
today.setHours(0, 0, 0, 0);
const checkAmount = value => value > 0;
export default {
  name: "Add",
  components: {
    DatePicker
  },
  data() {
    return {
      open: false,
      items: [],
      methodOptions: [
        { value: "cash", text: "Cash" },
        { value: "cheque", text: "Cheque" },
        { value: "bank transfer", text: "Bank Transfer" }
      ],
      credit: {
        amount: "",
        method: null,
        date: "",
        time: "",
        remark: ""
      }
    };
  },
  validations() {
    return {
      credit: {
        amount: {
          maxValue: checkAmount
        },
        method: { required },
        date: { required },
        time: { required }
      }
    };
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (!this.$v.credit.$error) {
        this.$emit("fetch-data", this.$v.credit.$model);
        this.$v.credit.$model = "";
      }
    },
    status(validation) {
      return validation.$error
        ? "is-invalid"
        : validation.$dirty
        ? "is-valid"
        : "";
    },
    checkAmnt(amnt) {
      alert(amnt);
    },
    notBeforeToday(date) {
      return date < today;
    },
    handleChange(value, type) {
      if (type === "second") {
        this.open = false;
      }
    }
  }
};
</script>

<style>
</style>