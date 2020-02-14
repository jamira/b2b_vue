<template>
  <div id="top-up-list">
    <b-card class="shadow mb-4" header="Top Up History" header-tag="div">
      <b-table striped hover :items="formattedDisplatTopUps" caption-top>
        <!-- <template v-slot:table-caption>This is a table caption at the top.</template> -->
      </b-table>
    </b-card>
    {{ topUps }}
    <b-card class="shadow mb-4" header="Pending Request" header-tag="div">
      <b-table striped hover :items="tblList"></b-table>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "List",
  props: {
    item: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tblList: []
    };
  },
  methods: {
    addItem() {
      this.tblList.push({
        created:
          this.$moment(this.item[0].date).format("YYYY-MM-DD") +
          " " +
          this.item[0].time,
        amount: this.item[0].amount,
        method: this.item[0].method,
        remarks: this.item[0].remarks,
        status: 0
      });

      const newItems = this.tblList[this.tblList.length - 1];
      this.$alert({
        title: "THK Message",
        content: `${newItems.amount} amount of Credits is sucessfully added! Please wait while we are validating your topup request.`
      });

      // insert data to DB
      let data = {
        amount: this.item[0].amount,
        method: this.item[0].method,
        remarks: this.item[0].remarks,
        topup_file: this.item[0].file.name
      };
      this.$store.dispatch("INSERT_TOPUP", data);
    },
    fetchTopUps() {
      this.$store.dispatch("GET_TOPUPS");
    }
  },
  computed: {
    ...mapState({
      topUps: state => state.topUps
    }),
    formattedDisplatTopUps() {
      return this.topUps.map(item => {
        return {
          Date: item.created_at,
          amount: item.amount,
          remarks: item.remarks,
          method: item.method,
          status: item.status == 0 ? "Pending" : "Approved"
        };
      });
    }
  },
  watch: {
    item: {
      deep: true,
      handler: "addItem"
    }
  },
  async created() {
    await this.fetchTopUps();
  }
};
</script>

<style>
</style>