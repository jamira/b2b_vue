<template>
  <div class="content">
    <AddCredit @fetch-data="fetchData" />
    <ListCredit :item="item" />
  </div>
</template>

<script>
import AddCredit from "../components/TopUp/Add";
import ListCredit from "../components/TopUp/List";
export default {
  name: "TopUp",
  components: {
    AddCredit,
    ListCredit
  },
  data() {
    return {
      item: []
    };
  },
  methods: {
    fetchData(e) {
      this.item.push(e);
    }
  }
};
</script>

<style>
</style>