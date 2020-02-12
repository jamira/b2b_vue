<template>
  <div id="top-up-list">
    <b-card class="shadow mb-4" header="Top Up History" header-tag="div">
      <b-table striped hover :items="tblList" caption-top>
        <template v-slot:table-caption>This is a table caption at the top.</template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
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
      tblList: [
        {
          createdDate: "24 Jan 2020",
          method: "Transfer",
          remark:
            "Morbi tincidunt nibh in lorem rutrum porta. Mauris mollis metus nec ornare sagittis. Suspendisse nisi mauris, ultrices at varius a, malesuada id nulla.",
          amount: 1000,
          status: "Approved"
        },
        {
          createdDate: "05 Feb 2020",
          method: "Transfer",
          remark:
            "Nullam consequat varius metus, et lacinia purus fringilla sit amet. Nam facilisis metus vel libero egestas placerat",
          amount: 1500,
          status: "Approved"
        },
        {
          createdDate: "09 Feb 2020",
          method: "Transfer",
          remark: "This is some remarks",
          amount: 1200,
          status: "Approved"
        }
      ]
    };
  },
  methods: {
    addItem() {
      this.tblList.push({
        createdDate: "11 Feb 2020",
        method: this.item[0].method,
        remark: this.item[0].remark,
        amount: this.item[0].amount,
        status: "Pending"
      });

      const newItems = this.tblList[this.tblList.length - 1];
      this.$alert({
        title: "THK Message",
        content: `${newItems.amount} amount of Credits is sucessfully added! Please wait while we are validating your topup request.`
      });
    }
  },
  watch: {
    item: {
      deep: true,
      handler: "addItem"
    }
  }
};
</script>

<style>
</style>