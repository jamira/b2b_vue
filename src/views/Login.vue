<template>
  <b-row class="justify-content-center">
    <b-col xl="5" md="12">
      <b-card header="Login" header-tag="div">
        <b-form @submit.prevent="onSubmit">
          <b-form-group id="b2b-username" label="Email Address:" label-for="b2b-email-input">
            <b-form-input
              id="b2b-email-input"
              v-model="login.email"
              type="email"
              placeholder="Enter email address"
              :class="status($v.login.email)"
              trim
            ></b-form-input>
            <b-form-invalid-feedback v-if="!login.email.required">Please enter your email</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group id="b2b-password" label="Password:" label-for="b2b-password-input">
            <b-form-input
              id="b2b-password-input"
              v-model="login.password"
              type="password"
              placeholder="Enter password"
              :class="status($v.login.password)"
              trim
            ></b-form-input>
            <b-form-invalid-feedback v-if="!login.password.required">Please enter your password</b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="primary" block>Login</b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapState } from "vuex";
export default {
  data() {
    return {
      login: {
        email: "",
        password: ""
      }
    };
  },
  validations: {
    login: {
      email: {
        email,
        required
      },
      password: {
        required
      }
    }
  },
  computed: {
    ...mapState({
      ismessage: state => state.message,
      loading: state => state.isLoading
    })
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (!this.$v.login.$error) {
        this.signIn(this.$v.login.$model.email, this.$v.login.$model.password);
      }
    },
    status(validation) {
      return validation.$error ? "is-invalid" : validation.$dirty ? "" : "";
    },
    signIn(email, password) {
      let login = {
        email: email,
        password: password
      };
      this.$store.dispatch("LOG_ME_IN", login);

      if (this.ismessage !== "") {
         const message = this.ismessage;
          this.$alert({
            title: "THK Message",
            content: message
          });
      }
    }
  }
};
</script>
 