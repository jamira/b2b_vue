import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from "./store";
import axios from "axios"
import vueaxios from "vue-axios"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueMoment from 'vue-moment'
import Vuelidate from 'vuelidate'
import VueCurrencyFilter from 'vue-currency-filter'

import './assets/scss/custom.scss';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(vueaxios, axios)
Vue.use(VueMoment)
Vue.use(Vuelidate)

Vue.use(VueCurrencyFilter,
  {
    symbol: "$",
    thousandsSeparator: ",",
    fractionCount: 2,
    fractionSeparator: ".",
    symbolPosition: "front",
    symbolSpacing: true
  })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
