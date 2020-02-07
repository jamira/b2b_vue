import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from "./store";
import axios from "axios"
import VueAxios from "vue-axios"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueMoment from 'vue-moment'
import Vuelidate from 'vuelidate'
import VueCurrencyFilter from 'vue-currency-filter'
import vbMsgBox from 'bootstrap-vue-msgbox'

import './assets/scss/custom.scss';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(VueMoment)
Vue.use(Vuelidate)
Vue.use(vbMsgBox)


Vue.use(VueCurrencyFilter, {
  symbol: "$",
  thousandsSeparator: ",",
  fractionCount: 2,
  fractionSeparator: ".",
  symbolPosition: "front",
  symbolSpacing: true
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
