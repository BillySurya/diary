<template>
  <div v-if="!loading">
    <div v-for="(list, listKey, idx) in listData" :key="idx">
      <h2>{{ Number(listKey) | moment('DD MMMM') }}</h2>
      <div v-for="(item, itemIdx) in list" :key="itemIdx">
        <span>{{ item.created_at | moment('HH:mm') }} </span>
        <span>{{ item.name }} </span>
        <span>{{ item.cost | formatRupiah }}</span>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatRupiah } from  "../shared/utils";

export default {
  name: "DairyPage",
  props: {
    msg: String,
  },
  filters: {formatRupiah},
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
    },
    formatRupiah
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
