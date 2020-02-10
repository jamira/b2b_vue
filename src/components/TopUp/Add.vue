<template>
  <div id="add-credit">
    <b-card class="shadow mb-4" header="Add Credit" header-tag="div">
      <b-form @submit.prevent="onSubmit">
        <b-form-row>
          <b-col md="4" class="mb-2">
            <b-form-group label="Amount">
              <b-form-input id="amount" v-model="credit.amount" trim></b-form-input>
              <!-- <b-form-invalid-feedback v-if="!credit.amount.required">Please enter amount</b-form-invalid-feedback> -->
            </b-form-group>
          </b-col>

          <b-col md="4" class="mb-2">
            <b-form-group label="Method">
              <b-form-select v-model="credit.method" :options="methodOptions">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
                </template>
              </b-form-select>
              <!-- <b-form-invalid-feedback v-if="!credit.method.required">Please select option method</b-form-invalid-feedback> -->
            </b-form-group>
          </b-col>

          <b-col md="4" class="mb-2">
            <b-form-group label="Time & Date">
              <b-form-input id="time-date" v-model="credit.dateTime" trim></b-form-input>
              <!-- <b-form-invalid-feedback v-if="!credit.dateTime.required">Please enter date & time</b-form-invalid-feedback> -->
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

        <b-form-row>
          <b-col md="4" class="mb-4">
            <b-form-file
              v-model="credit.file"
              placeholder="Top up proof of payment receipt..."
              drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-col>
        </b-form-row>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "Add",
  data() {
    return {
      methodOptions: [
        { value: "cash", text: "Cash" },
        { value: "cheque", text: "Cheque" },
        { value: "bank transfer", text: "Bank Transfer" }
      ],
      credit: {
        amount: 0,
        method: null,
        dateTime: "",
        remark: "",
        file: null
      }
    };
  },
  validations: {
    credit: {
      amount: { required },
      method: { required },
      dateTime: { required },
      file: { required }
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
    },
    status(validation) {
      return validation.$error
        ? "is-invalid"
        : validation.$dirty
        ? "is-valid"
        : "";
    }
  }
};
</script>

<style>
</style>