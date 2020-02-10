<template>
  <div id="top-up-list">
    <b-card class="shadow mb-4" header="Top Up History" header-tag="div">
        <b-table striped hover :items="tblList"></b-table>
        {{ items }}
    </b-card>
  </div>
</template>

<script>
export default {
  name: "List",
  props: ["items"],
  data() {
    return {
     tblList: [
        { createdDate: '24 Jan 2020', method: "Transfer", remarks: "Morbi tincidunt nibh in lorem rutrum porta. Mauris mollis metus nec ornare sagittis. Suspendisse nisi mauris, ultrices at varius a, malesuada id nulla.", amount: 1000, status: "Approved" },
        { createdDate: '05 Feb 2020', method: "Transfer", remarks: "Nullam consequat varius metus, et lacinia purus fringilla sit amet. Nam facilisis metus vel libero egestas placerat", amount: 1500, status: "Approved" },
        { createdDate: '09 Feb 2020', method: "Transfer", remarks: "This is some remarks", amount: 1200, status: "Approved" } 
     ]
    };
  }
}
</script>

<style>

</style>