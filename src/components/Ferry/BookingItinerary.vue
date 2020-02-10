<template>
  <div style="width: 800px; margin: 0 auto; padding: 0 10px;">
    <div class="header" style="padding:20px; 10px;">
      <div class="float-left">
        <b-img :src="logo" alt="THK Tour" width="450"></b-img>
      </div>
      <div class="float-right" style="color: #000;">
        <span style="text-transform: uppercase; font-size: 13px">Booking Code</span>
        <h4>{{ bookingDetail.booking_reference }}</h4>
      </div>
    </div>

    <div class="booking-info py-3" style="clear: both; color: #000; font-size: 13px; padding:0 10px;">
      <ul class="list-unstyled m-0">
        <li>
          <strong>Status:</strong> {{ bookingDetail.status }}
        </li>
        <li>
          <strong>Booking Date:</strong> {{ this.$moment(bookingDetail.created_at).format("dddd. DD MMMM. YYYY") }}
        </li>
        <li>
          <strong>Total Pax:</strong> {{ bookingDetail.adult + bookingDetail.child }}
        </li>
      </ul>
    </div>

    <div class="booking-details" style="padding:0 10px;">
        <b-table :items="formattedCustomers" striped style="color: #000; font-size: 13px;" class="mb-4">
            <template v-slot:cell(DepartPort)="data">
                <div v-html="data.value"></div>
            </template>
            <template v-slot:cell(ReturnPort)="data">
                <div v-html="data.value" v-if="bookingDetail.journey_type === '2'"></div>
                <div v-else>None</div>
            </template>
        </b-table>
        <b-table :items="servicesFee" style="color: #000; font-size: 13px;" class="mb-4" caption-top>
            <template v-slot:table-caption>
                <strong style="color: #000;">Ferry Ticket Fare & Service Fees Details</strong> </template>
        </b-table>        
    </div>

   <div class="guides" style="color: #000; font-size: 13px; padding:0 15px;">
      <strong>Fee Details</strong>
      <ul class="px-2 mb-3">
        <li>You are required to collect your boardingpass 60 mins before your departure time or seats will be automatically released.</li>
        <li>This fare type is NOT transferable to another passenger</li>
        <li>This fare type is capacity controlled and limited and hence, may not be available on all ferries</li>
        <li>This fare type is always subject to our General Terms and Conditions</li>
      </ul>
      <strong>Travel Guide In Terminal</strong>
      <ul class="px-2 mb-2">
        <li>Use our Self Check-In facilities, log onto our website on the facilities available</li>
        <li>Check-in deadlines may vary at different seaports and for particular ferries. It is your responsibility to ensure that you comply with these deadlines</li>
        <li>Do not carry any liquids, aerosols and gels more than 100ml in your cabin baggage</li>
        <li>
          Some seaports have long queues due to complex security checks. We suggest that you check-in early and proceed immediately to the departure gate or you may
          risk being left behind in security.
        </li>
        <li>Guests may not use the unused checked baggage weight of other guests unless travelling on the same Itinerary</li>
        <li>Guests are strongly advised not to check in goods which are valuable and fragile as baggage</li>
        <li>
          You are responsible for obtaining all valid entry and exit visas, health and other required documents, ensuring that your passport meets the destination’s entry
          requirements
        </li>
        <li>Our full Terms and Conditions will apply. For full details please visit https://thktour.com/</li>
      </ul>
    </div>    
  </div>
</template>
<script>
import { mapState } from "vuex";
import logo from "../../assets/thk-letter-head.png";
export default {
  name: "Book Itinerary",
  data() {
    return {
      logo: logo
    };
  },
  props: ["ID"],
  computed: {
    ...mapState({
      bookingDetail: state => state.reservationById
    }),
    formattedCustomers() {
      return this.bookingDetail.customers.map(item => {
        return {
          Name: item.name,
          Passport: item.passport_no,
          Nationality: item.nationality,
          JourneyType: item.journey_type === "2" ? 'Two-Way' : 'One-Way',
          DepartPort: "<span class='d-block'>" + this.bookingDetail.departure_port + "</span>" 
          + "<span class='d-block'>" + this.$moment(this.bookingDetail.travel_date).format("dd. DD MMM. YYYY") + "</span>"
          + "<span class='d-block'>(" + this.bookingDetail.travel_time + ")</span>",
          ReturnPort: "<span class='d-block'>" + this.bookingDetail.return_port + "</span>" 
          + "<span class='d-block'>" + this.$moment(this.bookingDetail.return_date).format("dd. DD MMM. YYYY") + "</span>"
          + "<span class='d-block'>(" + this.bookingDetail.return_time + ")</span>",
        };
      });
    },
    servicesFee() {
        return [{
            ferryTicket: "Paid",
            surcharges: "Paid",
            TerminalFees: "Paid",
            TravelInsurance: this.isInsurance ? 'Paid' : 'None',
            ExpressClearance: this.isClearance ? 'Paid' : 'None'
        }];
    },
    isClearance() {
      const isClearance = this.bookingDetail.customers.filter(
        item => item.express_clearance
      );

      return isClearance.length;
    },
    isInsurance() {
      const isInsurance = this.bookingDetail.customers.filter(
        item => item.travel_insurance
      );

      return isInsurance.length;
    }
  },
  methods: {
    getReservation() {
      this.$store.dispatch("GET_RESERVATION_BY_ID", this.ID);
    }
  },
  async created() {
    await this.getReservation();
  }  
};
</script>


