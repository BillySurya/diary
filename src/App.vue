<template>
  <div id="app">
    <DiaryPage msg="Hello" />
  </div>
</template>

<script>
import DiaryPage from "./components/DiaryPage.vue";

export default {
  name: "App",
  components: {
    DiaryPage,
  },
};
</script>
