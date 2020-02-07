<template>
  <div ref="content" style="width: 700px; margin: 0 auto; padding: 0 15px;">
    <div class="header" style="padding:0 15px;">
      <div class="float-left">
        <b-img :src="logo" alt="THK Tour"></b-img>
      </div>
      <div class="float-right" style="color: #000;">
        <span style="text-transform: uppercase; font-size: 12px">Booking Code</span>
        <h4>THK6087940</h4>
      </div>
    </div>

    <div class="booking-info" style="clear: both; color: #000; font-size: 12px; padding:0 15px;">
      <ul class="list-unstyled">
        <li>
          <strong>Booking Name:</strong> THKL0220031
        </li>
        <li>
          <strong>Booking Date:</strong> 5 February 2020
        </li>
        <li>
          <strong>Total Pax:</strong> 2
        </li>
      </ul>
    </div>

    <div class="booking-details" style="padding-right: 10px;">
      <b-table-simple striped small style="color: #000; font-size: 12px;">
        <b-thead>
          <b-tr>
            <b-th>No</b-th>
            <b-th>Passport No</b-th>
            <b-th>Name</b-th>
            <b-th>Nationality</b-th>
            <b-th>Journey</b-th>
            <b-th>Depart Trip</b-th>
            <b-th>Return Trip</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr>
            <b-td>1</b-td>
            <b-td>EC5122642</b-td>
            <b-td>Mark Zalik</b-td>
            <b-td>SINGAPOREAN</b-td>
            <b-td>Two-Way</b-td>
            <b-td>
              <span>HarbourFront to Batam Center</span>
              <span>22 February 2020</span>
              <span>(15:20hrs SG)</span>
            </b-td>
            <b-td>
              <span>Batam Center to HarbourFront</span>
              <span>23 February 2020</span>
              <span>(16:45hrs WIB)</span>
            </b-td>
          </b-tr>
        </b-tbody>
        <b-tbody></b-tbody>
      </b-table-simple>
      <b-table-simple caption-top small style="color: #000; font-size: 12px;">
        <caption style="color: #000;">Ferry Ticket Fare & Service Fees Details</caption>
        <b-thead>
          <b-tr>
            <b-th>Ferry Ticket</b-th>
            <b-th>Surcharges</b-th>
            <b-th>Depart Terminal Fee</b-th>
            <b-th>Return Terminal Fee</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr>
            <b-td>PAID</b-td>
            <b-td>PAID</b-td>
            <b-td>PAID</b-td>
            <b-td>PAID</b-td>
          </b-tr>
        </b-tbody>
        <b-tbody></b-tbody>
      </b-table-simple>
    </div>

    <div class="guides my-3" style="color: #000; font-size: 12px;">
      <strong>Fee Details</strong>
      <ul class="px-4">
        <li>You are required to collect your boardingpass 60 mins before your departure time or seats will be automatically released.</li>
        <li>This fare type is NOT transferable to another passenger</li>
        <li>This fare type is capacity controlled and limited and hence, may not be available on all ferries</li>
        <li>This fare type is always subject to our General Terms and Conditions</li>
      </ul>
      <strong>Travel Guide In Terminal</strong>
      <ul class="px-4">
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
        <li>-Our full Terms and Conditions will apply. For full details please visit https://thktour.com/</li>
      </ul>
    </div>
    <button @click="downloadPDF">Download PDF WITH CSS</button>
  </div>
</template>

<script>
// import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import logo from "../assets/logo.png";
export default {
  data() {
    return {
      logo: logo,
      items: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        { age: 89, first_name: "Geneva", last_name: "Wilson" },
        { age: 38, first_name: "Jami", last_name: "Carney" }
      ]
    };
  },
  methods: {
    downloadPDF() {
      //const doc = new jsPDF();
      /** WITHOUT CSS */
      const contentHtml = this.$refs.content.innerHTML;
      var opt = {
        filename: "travel_itinerary.pdf",
        jsPDF: {
          setFontSize: 13,
          unit: "mm",
          format: "a4"
        }
      };
      html2pdf()
        .set(opt)
        .from(contentHtml)
        .save();
    }
  }
};
</script>