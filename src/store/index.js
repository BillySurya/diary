import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    item: {},
  },
  getters: {
    item: (state) => state.item,
  },
  mutations: {
    setItemData(state, item) {
      Vue.set(state.item, "data", item);
    },
    setAddedItem(state, response) {
      state.item.data.push(response);
    },
  },
  actions: {
    getItemList({ commit }) {
      axios.get("http://localhost:3000/items").then((res) => {
        commit("setItemData", res.data);
      });
    },
    addDiary({ commit }, params) {
      axios.post("http://localhost:3000/items", params).then((res) => {
        commit("setAddedItem", res.data);
      });
    },
  },
  modules: {},
});
