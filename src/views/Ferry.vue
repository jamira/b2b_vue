<template>
  <div class="content">
    <h1 class="h2 text-gray-800 mb-4">Ferry</h1>
    <div class="row">
      <div class="col-xl-12">
        <FerrySearchForm />
        <FerryResults />
      </div>
    </div>
  </div>
</template>

<script>
import FerrySearchForm from "@/components/Forms/FerrySearchForm.vue";
import FerryResults from "@/components/FerryResults.vue";
export default {
  name: "Ferry",
  components: {
    FerrySearchForm,
    FerryResults
  },
  methods: {
    fetchJourney() {
      this.$store.dispatch("GET_JOURNEY");
    }
  },
  async created() {
    await this.fetchJourney();
  }
};
</script>

<style>
</style>