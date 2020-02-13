import Vue from 'vue'
import Vuex from 'vuex'
import http from "../utils/http"
import router from '../router'

Vue.use(Vuex)

export const auth = () => {
  return {
    Username: "thktourthk",
    SecurityKey: "thktourapi888"
  };
};

export const store = new Vuex.Store({
  state: {
    ferryDestinations: [],
    schedule: [],
    searchQuery: "",
    isLoading: false,
    selectedDeparture: "",
    selectedReturn: "",
    expressClearance: false,
    travelInsurance: [],
    errorMessage: [],
    bookingDetails: {},
    post: [],
    token: "",
    reservations: [],
    bookings: {},
    passengers: [],
    reservationById: {},
    currentBalance: {},
    currentUser: {},
    totalAmount: 0,
    message: "",
    isLogin: false
  },
  getters: {
    insurance: state => {
      const chkTrue = state.travelInsurance.filter(item => item.TravelInsurance === true);
      return chkTrue.length;
    }
  },
  mutations: {
    SET_JOURNEY: (state, payload) => (state.ferryDestinations = payload),
    SET_SCHEDULE(state, payload) {
      let tmpArray = [];
      tmpArray.push(payload);
      state.schedule = tmpArray;
    },
    SET_SEARCH_QUERY: (state, payload) => (state.searchQuery = payload),
    SET_LOADING: (state, payload) => (state.isLoading = payload),
    SET_SELECTED_DEPART_SCHEDULE: (state, payload) => (state.selectedDeparture = payload),
    SET_SELECTED_RETURN_SCHEDULE: (state, payload) => (state.selectedReturn = payload),
    SET_EXPRESS_CLEARANCE: (state, payload) => (state.expressClearance = payload),
    SET_HAS_INSURANCE(state, payload) {
      let findKey = state.travelInsurance.find(item => item.key === payload.key);
      if (findKey) {
        findKey.TravelInsurance = payload.TravelInsurance;
      } else {
        state.travelInsurance.push({
          key: payload.key,
          TravelInsurance: payload.TravelInsurance,
          PassportName: payload.PassportName,
          PassportNo: payload.PassportNo,
        });
      }
    },
    SET_PASSENGERS(state, payload) {
      state.passengers = payload;
    },
    SET_BOOKING_DETAILS: (state, payload) => (state.bookingDetails = payload),
    SET_MESSAGE: (state, payload) => state.message = payload,
    SET_POST: (state, payload) => (state.post = payload),
    SET_TOKEN: (state, payload) => (state.token = payload),
    SET_RESERVATIONS: (state, payload) => (state.reservations = payload),
    SET_BOOKING: (state, payload) => (state.bookings = payload),
    SET_RESERVATION_ID: (state, payload) => (state.reservationById = payload),
    SET_CURRENT_BALANCE: (state, payload) => (state.currentBalance = payload),
    SET_CURRENT_USER: (state, payload) => (state.currentUser = payload),
    SET_TOTAL_AMOUNT: (state, payload) => (state.totalAmount = payload),
    SET_LOGGED_IN: (state, payload) => (state.isLogin = payload)
  },
  actions: {
    async GET_JOURNEY({ commit }) {
      commit("SET_LOADING", true);
      let tmpArray = [];
      try {
        let res = await http.post('http://47.52.109.16/api/ferry-api/MFFJourney');

        // loop through all raw data and set new key on each item to filter the journey 
        for (let i = 0; i < res.data.length; i++) {
          const journeyCode = res.data[i].JourneyCode;
          const journey = res.data[i];

          if (journey.DepartCountry === "SINGAPORE") { // use Vue.set for reactivity when updating array/object keys
            if (journeyCode === "HBF to BTC" || journeyCode === "HBF to SKP" || journeyCode === "TMF to BTC") {
              Vue.set(journey, "PairKey", "SG_BTM");
            }
            else if (journeyCode === "TMF to TNJ") {
              Vue.set(journey, "PairKey", "SG_TANPNG");
            }
            else if (journeyCode === "HBF to TBK") {
              Vue.set(journey, "PairKey", "SG_BALAI");
            }
            else {
              return;
            }
          }

          if (journey.DepartCountry === "INDONESIA") { // use Vue.set for reactivity when updating array/object keys
            if (journeyCode === "BTC to HBF" || journeyCode === "BTC to TMF" || journeyCode === "SKP to HBF") {
              Vue.set(journey, "PairKey", "SG_BTM");
            }
            else if (journeyCode === "TNJ to TMF") {
              Vue.set(journey, "PairKey", "SG_TANPNG");
            }
            else if (journeyCode === "TBK to HBF") {
              Vue.set(journey, "PairKey", "SG_BALAI");
            }
            else {
              return;
            }
          }

          tmpArray.push(journey)
        }

      } catch (error) {
        console.log('Error', error.message);
      }

      commit("SET_JOURNEY", tmpArray);
      commit("SET_LOADING", false);
    },
    async GET_SCHEDULE_PRICE({ commit }, data) {
      commit("SET_LOADING", true);
      try {
        let res = await http.post('http://47.52.109.16/api/ferry-api/MFFSchedule', {
          TicketCategory: "Normal",
          TotalPax: data.TotalPax,
          JourneyType: data.JourneyType,
          IsReturnOpenTicket: data.IsReturnOpenTicket,
          DepartPort: data.DepartPort,
          ArrivalPort: data.ArrivalPort,
          TravelDate: data.TravelDate,
          ReturnDepartPort: data.ReturnDepartPort,
          ReturnArrivalPort: data.ReturnArrivalPort,
          ReturnTravelDate: data.ReturnTravelDate
        });
        if (res.status === 200) {
          for (let index = 0; index < res.data.length; index++) {
            var arrReference = res.data[index];
            let departCode = arrReference.DepartTrips.map(key => key.JourneyCode);
            let returnCode = arrReference.ReturnTrips.map(key => key.JourneyCode);

            // set the pricing manually for B2B
            arrReference.Price.forEach(item => {
              if (item.JourneyType === "1") {
                Vue.set(item, "NewPrice", "12.00");
                Vue.set(item, "NewDepartTerminalFee", "8.00");

              } else if (item.JourneyType === "2") {
                Vue.set(item, "NewPrice", "3.00");
                Vue.set(item, "NewDepartTerminalFee", "8.00");
                Vue.set(item, "NewReturnTerminalFee", "8.00");
                Vue.set(item, "THKTaxFee", "8.00");

                if (departCode[0] === "TMF to TNJ" && returnCode[0] === "TNJ to TMF") {
                  Vue.set(item, "NewPrice", "12.00");
                  Vue.set(item, "NewDepartTerminalFee", "8.00");
                  Vue.set(item, "NewReturnTerminalFee", "8.00");
                  Vue.set(item, "THKTaxFee", "13.00");
                  Vue.set(item, "BookingFee", "2.00");
                }

                if (departCode[0] === "HBF to TBK" && returnCode[0] === "TBK to HBF") {
                  Vue.set(item, "NewPrice", "17.50");
                  Vue.set(item, "NewPriceChild", "12");
                  Vue.set(item, "NewDepartTerminalFee", "0.00");
                  Vue.set(item, "NewReturnTerminalFee", "0.00");
                  Vue.set(item, "THKTaxFee", "15.00");
                }

              } else {
                return;
              }
            });
          }

          commit("SET_SCHEDULE", arrReference);
          commit("SET_LOADING", false);
        }

      } catch (error) {
        console.log(error);
      }
    },
    async CREATE_BOOKING({ commit }, data) {
      commit("SET_LOADING", true);
      try {
        let res = await http.post('http://47.52.109.16/api/ferry-api/MFFPassengerBooking', {
          Username: "thktourthk",
          SecurityKey: "thktourapi888",
          BookingName: "test",
          TicketCategory: "Normal",
          JourneyType: data.JourneyType,
          IsReturnOpenTicket: data.IsReturnOpenTicket,
          DepartTripCode: data.DepartTripCode,
          DepartSeatCategory: data.DepartSeatCategory,
          TravelDate: data.TravelDate,
          ReturnTripCode: data.ReturnTripCode,
          ReturnSeatCategory: data.ReturnSeatCategory,
          ReturnTravelDate: data.ReturnTravelDate,
          IncludeDepartTerminalFee: data.IncludeDepartTerminalFee,
          IncludeReturnTerminalFee: data.IncludeReturnTerminalFee,
          Passenger: data.Passenger
        });

        if (res.status === 200) {
          commit("SET_BOOKING_DETAILS", res.data);
          commit("SET_LOADING", false);
        }

      } catch (error) {
        console.log(error);
      }

    },
    async CANCEL_BOOKING({ commit }) {
      commit("SET_LOADING", true);
      try {
        let res = await http.post("http://47.52.109.16/api/ferry-api/MFFCancelBooking");
        console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    },
    async GET_POST({ commit }) {
      commit("SET_LOADING", true);
      try {
        let res = await http.get("https://jsonplaceholder.typicode.com/posts");
        let tmpArray = [];
        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            var dataField = res.data[key];
            dataField.isShow = false;
            tmpArray.push(dataField)
          }
        }
        commit("SET_POST", tmpArray);
        commit("SET_LOADING", false);
      } catch (error) {
        console.log(error);
      }
    },
    LOG_ME_IN({ commit }, data) {
      commit("SET_LOADING", true);
      // email: "merchant1@test.com",
      // password: "thkpassword"
      http.post("http://47.52.109.16/api/auth/login", data).then(res => {
        localStorage.setItem('token', res.data.payload.token);
        commit("SET_TOKEN", res.data.payload.token);
        commit("SET_CURRENT_USER", res.data.payload.user);
        commit("SET_LOADING", false);
        commit("SET_LOGGED_IN", true);
        router.push("/ferry/search");
      }).catch(error => {
        commit("SET_MESSAGE", error.response.data.message);
        //console.log(error.response.data.message);
        commit("SET_LOADING", false);
      });
    },
    INSERT_RESERVATION({ commit }, data) {
      http.post("http://47.52.109.16/api/reservations", data).then(res => {
        console.log(res.response.data.message);
        commit("SET_CURRENT_BALANCE", res.data.payload);
      }).catch(error => {
        commit("SET_MESSAGE", error.response.data.message);
      });
    },
    GET_RESERVATIONS({ commit }) {
      http.get("http://47.52.109.16/api/reservations").then(res => {
        commit("SET_LOADING", true);
        commit("SET_RESERVATIONS", res.data.payload.reservations);
        commit("SET_LOADING", false);
      }).catch(error => {
        commit("SET_MESSAGE", error.response.data.message);
        //console.log(error.response.data.message);
      });
    },
    GET_RESERVATION_BY_ID({ commit }, ID) {
      commit("SET_LOADING", true);
      http.get("http://47.52.109.16/api/reservations/" + ID).then(res => {
        commit("SET_RESERVATION_ID", res.data.payload.reservation);
        commit("SET_LOADING", false);
      }).catch(error => {
        //console.log(error.response.data);
        commit("SET_MESSAGE", error.response.data.message);
      });
    },
    SEND_BOOKING_EMAIL({ commit }, data) {
      http.post("http://47.52.109.16/api/email/jdbadassnewbie326@gmail.com/pdf", data).then(res => {
        console.log(res.data.payload.message);
        commit("SET_MESSAGE", res.data.payload.message);
      }).catch(error => {
        commit("SET_MESSAGE", error.response.data.message);
        //console.log(error.response.data.message);
      });
    }
  },
  modules: {
  }
})

