import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";


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
    countries: [],
    expressClearance: false,
    travelInsurance: [],
    bookingDetails: {},
  },
  getters: {
    travelDestinations: state => {
      return state.ferryDestinations;
    },
    schedules: state => {
      return state.schedule;
    },
    searchQuery: state => {
      return state.searchQuery;
    },
    loading: state => {
      return state.isLoading;
    },
    clearance(state) {
      return state.expressClearance;
    },
    departSchedule: state => {
      return state.selectedDeparture;
    },
    returnSchedule: state => {
      return state.selectedReturn;
    },
    insurance: state => {
      return state.travelInsurance;
    },
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
    SET_EXPRESS_CLEARANCE: (state) => (state.expressClearance = !state.expressClearance),
    SET_HAS_INSURANCE(state, payload) {
      let findKey = state.travelInsurance.find(item => item.key === payload.key);
      if (findKey) {
        findKey.TravelInsurance = payload.TravelInsurance;
      } else {
        state.travelInsurance.push({
          key: payload.key,
          TravelInsurance: payload.TravelInsurance,
          PassportName: payload.PassportName,
          PassportNo: payload.PassportNo
        });
      }
    },
    SET_BOOKING_DETAILS: (state, payload) => (state.bookingDetails = payload),
  },
  actions: {
    async GET_JOURNEY() {
      let tmpArray = [];
      try {
        let res = await axios.post('/api/ferry/MFFWebservices/MFFJourney', {
          Username: "thktourthk",
          SecurityKey: "thktourapi888"
        });

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
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }

      store.commit("SET_JOURNEY", tmpArray);
    },
    async GET_SCHEDULE_PRICE({ commit }, data) {
      commit("SET_LOADING", true);
      try {
        let res = await axios.post('/api/ferry/MFFWebservices/MFFSchedule', {
          Username: "thktourthk",
          SecurityKey: "thktourapi888",
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
                  Vue.set(item, "THKTaxFee", "21.00");
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
      console.log(data);
      try {
        let res = await axios.post('/api/ferry/MFFWebservices/MFFPassengerBooking', {
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

        console.log(res)
        if (res.status === 200) {
          commit("SET_BOOKING_DETAILS", res);
          commit("SET_LOADING", false);
        }

      } catch (error) {
        console.log(error);
      }

    }
  },
  modules: {
  }
})
