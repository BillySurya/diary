<template>
  <div v-if="!loading">
    <div v-for="(list, listKey, idx) in listData" :key="idx">
      <h2>{{ listKey }}</h2>
      <div v-for="(item, itemIdx) in list" :key="itemIdx">
        <span>{{ item.created_at }} </span>
        <span>{{ item.name }} </span>
        <span>{{ item.cost }}</span>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DairyPage",
  props: {
    msg: String,
  },
  data() {
    return {
      listData: {},
      loading: true,
    };
  },
  computed: {
    ...mapGetters({
      itemList: "item",
    }),
  },
  methods: {
    ...mapActions({
      getItemList: "getItemList",
    }),
    reformatData(item) {
      item.forEach((el) => {
        let dateTimeItem = el.created_at.split(" ");
        if (!Object.prototype.hasOwnProperty.call(this.listData, dateTimeItem[0]))
          this.listData[dateTimeItem[0]] = [];
        this.listData[dateTimeItem[0]].push(el);
      });

      this.loading = Object.keys(this.listData).length ? false : true
    }
  },
  created() {
    this.getItemList();
  },
  watch: {
     itemList: {
      deep: true,
      handler(res) {
        res.data ? this.reformatData(res.data) : false
      }
    }
  }
};
</script>
