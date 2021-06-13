<template>
  <div class="font-sans max-w-screen-xl my-8 mx-auto">
    <div class="flex flex-col justify-center font-semibold mb-12 text-center">
      <span class="text-xl">Diari Jajan Bulan {{ month_select }} 2021</span>
      <small
        >Pengeluaran Bulan Ini {{ calculateTotalCostPerMonth() | formatRupiah }}
      </small>
      <div>
        <button
          :class="`my-2 ${
            isCurrentMonth
              ? 'text-white rounded-md py-2 px-3 cursor-pointer border-none bg-purple-900'
              : 'text-black rounded-md py-2 px-3 cursor-auto bg-gray-200'
          }`"
          @click="showModal = true"
          :disabled="!isCurrentMonth"
        >
          TAMBAH ITEM
        </button>
      </div>
      <div class="text-center mt-2">
        <select
          class="p-2 rounded-md bg-transparent border border-black"
          v-model="month_select"
        >
          <option v-for="(month, index) in monthList" :key="index">
            {{ month }}
          </option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-5" v-if="!loading">
      <div
        v-for="(list, listKey, idx) in listData"
        class="border border-gray-300 rounded-md p-4 shadow-md"
        :key="idx"
      >
        <div class="mb-2 mx-0 pb-2 border-b">
          <b>{{ Number(listKey) | moment("DD MMMM") }}</b>
        </div>
        <div
          v-for="(item, itemIdx) in list"
          class="flex justify-start border-b px-2 py-1"
          :key="itemIdx"
        >
          <span class="whitespace-nowrap overflow-hidden overflow-ellipsis pr-2"
            >{{ item.created_at | moment("HH:mm") }}
          </span>
          <span
            class="
              whitespace-nowrap
              overflow-hidden overflow-ellipsis
              mr-auto
              w-24
            "
            >{{ item.name }}
          </span>
          <span
            class="
              whitespace-nowrap
              overflow-hidden overflow-ellipsis
              w-24
              text-right
            "
            >{{ item.cost | formatRupiah }}</span
          >
        </div>
        <div class="flex justify-end border-gray-400 border-t pt-2 px-2">
          <b>
            Total
            <span class="pl-4">{{
              totalCostItemPerDay[listKey] | formatRupiah
            }}</span>
          </b>
        </div>
        <br />
      </div>
    </div>
    <diary-modal v-show="showModal" @close="closeModal" @submit="submitDiary">
    </diary-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatRupiah } from "../shared/utils";
import DiaryModal from "./DiaryModal";
import moment from "moment";

export default {
  name: "DairyPage",
  props: {
    msg: String,
  },
  components: { DiaryModal },
  filters: { formatRupiah },
  data() {
    return {
      showModal: false,
      listData: {},
      loading: true,
      totalCostItemPerDay: {},
      month_select: "",
      monthList: moment.monthsShort(),
      isCurrentMonth: false,
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
    reformatData(item, month) {
      let diaryListData = [...item];
      let _data = {};
      diaryListData.sort(
        (a, b) =>
          new Date(b["created_at"]).getTime() -
          new Date(a["created_at"]).getTime()
      );

      diaryListData.forEach((el) => {
        if (moment(el.created_at).format("MMM") == month) {
          let dateTimeItem = el.created_at.split(" ");
          let dateMillis = new Date(dateTimeItem[0]).getTime();
          if (!Object.prototype.hasOwnProperty.call(_data, dateMillis))
            _data[dateMillis] = [];

          _data[dateMillis].push(el);
        }
      });

      Object.keys(_data).forEach((i) => {
        _data[i].sort(
          (a, b) =>
            new Date(a["created_at"]).getTime() -
            new Date(b["created_at"]).getTime()
        );
      });

      this.listData = _data;
      this.loading = Object.keys(this.listData).length ? false : true;
    },
    getTotalCost() {
      if (!Object.keys(this.listData).length)
        this.totalCostItemPerDay = this.listData;

      Object.keys(this.listData).forEach((key) => {
        this.totalCostItemPerDay[key] = this.listData[key].reduce(
          (n, { cost }) => n + cost,
          0
        );
      });
    },
    calculateTotalCostPerMonth() {
      let totalCost = 0;
      Object.keys(this.totalCostItemPerDay).forEach((key) => {
        totalCost += this.totalCostItemPerDay[key];
      });

      return totalCost;
    },
    closeModal() {
      this.showModal = false;
    },
    submitDiary(data) {
      let params = {
        name: data.name,
        cost: Number(data.cost),
        created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      };
      this.addDiary(params);
      this.closeModal();
    },
    checkCurrentMonth() {
      this.isCurrentMonth = this.month_select === moment().format("MMM");
    },
    formatRupiah,
  },
  created() {
    this.getItemList();
    this.month_select = moment().format("MMM");
  },
  watch: {
    itemList: {
      deep: true,
      handler(res) {
        if (res.data) {
          this.reformatData(res.data, this.month_select);
          this.getTotalCost();
          this.checkCurrentMonth();
        }
        return false;
      },
    },
    month_select(data) {
      if (this.itemList.data) {
        this.reformatData(this.itemList.data, data);
        this.getTotalCost();
        this.checkCurrentMonth();
      }
    },
  },
};
</script>
