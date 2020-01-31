<template>
  <div class="content">
    <h1 class="h2 text-gray-800 mb-4">Attraction</h1>
    <b-row>
      <b-col xl="8" md="12">
        <AttractionList :posts="limitPost" />
      </b-col>
      <b-col xl="4" md="12">
        <b-card class="shadow mb-4" header="Items Summary" header-tag="div"></b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AttractionList from "../components/AttractionList";
export default {
  name: "Attraction",
  components: {
    AttractionList
  },
  data() {
    return {
      loading: false,
      postData: null,
      error: null
    };
  },
  computed: {
    ...mapState({
      posts: state => state.post
    }),
    limitPost() {
      return this.posts.slice(0, 5);
    }
  },
  methods: {
    fetchPost() {
      this.$store.dispatch("GET_POST");
    }
  },
  async created() {
    await this.fetchPost();
  }
};
</script>

<style>
</style>