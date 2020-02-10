<template>
  <div class="content">
    <AddCredit @fetch-data="fetchData"/>
    <ListCredit :items="items" />
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
      items: []
    };
  },
  methods: {
    fetchData(e) {
      this.items.push(e)
    }
  }
};
</script>

<style>
</style>