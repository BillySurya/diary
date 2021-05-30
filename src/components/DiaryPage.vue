<template>
  <div v-if="!loading">
    <div v-for="(list, listKey, idx) in listData" :key="idx">
      <h2>{{ Number(listKey) | moment('DD MMMM') }}</h2>
      <div v-for="(item, itemIdx) in list" :key="itemIdx">
        <span>{{ item.created_at | moment('HH:mm') }} </span>
        <span>{{ item.name }} </span>
        <span>{{ item.cost | formatRupiah }}</span>
      </div>
      <div>
        Total {{ totalCostItemPerDay[listKey] | formatRupiah }}
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
      totalCostItemPerDay: {},
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
      let diaryListData = [...item];
      let _data = {};
      diaryListData.sort((a,b) => new Date(b['created_at']).getTime() - new Date(a['created_at']).getTime());

      diaryListData.forEach((el) => {
        let dateTimeItem = el.created_at.split(" ");
        let dateMillis = new Date(dateTimeItem[0]).getTime();
        if (!Object.prototype.hasOwnProperty.call(_data, dateMillis))
          _data[dateMillis] = [];

        _data[dateMillis].push(el);
      });

      Object.keys(_data).forEach(i=>{
        _data[i].sort((a,b) => new Date(a['created_at']).getTime() - new Date(b['created_at']).getTime());
      })

      this.listData = _data;
      this.loading = Object.keys(this.listData).length ? false : true;
    },
    getTotalCost() {
      Object.keys(this.listData).forEach((key) => {
        this.totalCostItemPerDay[key] = this.listData[key].reduce((n, {cost}) => n + cost, 0);
      });
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
        if(res.data) {
          this.reformatData(res.data);
          this.getTotalCost();
        }
        return false
      }
    }
  }
};
</script>
