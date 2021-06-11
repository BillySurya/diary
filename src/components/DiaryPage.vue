<template>
  <div v-if="!loading">
    <div>
      <span>Diari Jajan Bulan {{ itemList.data[0].created_at | moment('MM')}} 2021</span>
      <small>Pengeluaran Bulan Ini {{ calculateTotalCostPerMonth() | formatRupiah }} </small>
      <div>
        <button @click="showModal = true">TAMBAH ITEM</button>
      </div>
      <div class="text-center mt--md">
        <select v-model="month_select">
          <option v-for="(month, index) in monthList" :key="index">
            {{ month }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <div v-for="(list, listKey, idx) in listData"  :key="idx">
        <div>
          <b>{{ Number(listKey) | moment("DD MMMM") }}</b>
        </div>
        <div v-for="(item, itemIdx) in list" :key="itemIdx">
          <span>{{ item.created_at | moment("HH:mm") }} </span>
          <span>{{ item.name }} </span>
          <span>{{ item.cost | formatRupiah }}</span>
        </div>
        <div>
          <b> Total {{ totalCostItemPerDay[listKey] | formatRupiah }} </b>
        </div>
        <br />
      </div>
    </div>
    <diary-modal
      v-show="showModal"
      @close="closeModal"
      @submit="submitDiary"
    >
    </diary-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatRupiah } from "../shared/utils";
import DiaryModal from "./DiaryModal"
import moment from "moment";

export default {
  name: "DairyPage",
  props: {
    msg: String,
  },
  components: {DiaryModal},
  filters: {formatRupiah},
  data() {
    return {
      showModal: false,
      listData: {},
      loading: true,
      totalCostItemPerDay: {},
      month_select: 'Jan',
      monthList: moment.monthsShort()
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
      addDiary: "addDiary",
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
    calculateTotalCostPerMonth () {
      let totalCost = 0;
      Object.keys(this.totalCostItemPerDay).forEach((key) => {
        totalCost += this.totalCostItemPerDay[key]
      });

      return totalCost
    },
    closeModal() {
      this.showModal = false
    },
    submitDiary(data) {
      let params = {
        name: data.name,
        cost: Number(data.cost),
        created_at: moment().format("YYYY-MM-DD hh:mm:ss")
      }
      this.addDiary(params);
    },
    formatRupiah,
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
