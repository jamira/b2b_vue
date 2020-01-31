<template>
  <div>
    <div xl="12" v-for="post in posts" :key="post.id" class="shadow mb-3 p-3">
      <b-row>
        <b-col xl="3">
          <div>
            <b-img-lazy v-bind="mainProps" :src="getImageUrl(80)" alt="Image 1"></b-img-lazy>
          </div>
        </b-col>
        <b-col xl="6">
          <div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.body }}</p>
          </div>
        </b-col>
        <b-col xl="3">
          <div>
            <strong class="d-block mb-3">{{ price | currency }}</strong>
            <b-button variant="outline-primary" block @click="onShow(post)">View Attraction</b-button>
          </div>
        </b-col>
      </b-row>
      <div v-show="post.isShow" class="pt-4">Contect of item goes here</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttractionList",
  props: ["posts"],
  data() {
    return {
      price: 50.0,
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: "#bbb",
        width: 600,
        height: 400
      }
    };
  },
  methods: {
    getImageUrl(imageId) {
      const { width, height } = this.mainProps;
      return `https://picsum.photos/${width}/${height}/?image=${imageId}`;
    },
    onShow(post) {
      if ((post.isShow = !post.isShow)) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style>
</style>