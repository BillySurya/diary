<template>
  <div
    class="
      fixed
      inset-0
      bg-gray-900 bg-opacity-60
      flex
      justify-center
      items-center
    "
  >
    <div class="bg-white overscroll-x-auto flex flex-col w-72 rounded-sm p-3">
      <header
        class="
          p-2
          flex
          relative
          border-b
          font-medium
          text-md
          justify-between
          items-center
        "
      >
        <div>Tambah Entri</div>
        <div>
          <button type="button" @click="close">x</button>
        </div>
      </header>

      <section class="relative py-3 px-2">
        <div class="flex flex-col mb-3">
          <label class="text-sm" for="name">Nama</label>
          <input
            class="border border-black rounded-md p-0.5 px-2"
            name="name"
            type="text"
            v-model="diary.name"
          />
        </div>
        <div class="flex flex-col mb-3">
          <label class="text-sm" for="cost">Harga</label>
          <input
            class="border border-black rounded-md p-0.5 px-2"
            name="cost"
            type="number"
            v-model="diary.cost"
          />
        </div>
      </section>

      <footer class="p-2 flex border-t justify-end">
        <button
          type="button"
          class="
            text-black text-sm
            rounded-md
            py-2
            px-3
            cursor-pointer
            border-none
            bg-gray-200
            mr-2
          "
          @click="close"
        >
          Batal
        </button>
        <button
          type="button"
          class="
            text-white text-sm
            rounded-md
            py-2
            px-3
            cursor-pointer
            border-none
            bg-purple-900
          "
          @click="submit"
        >
          Kirim
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiaryModal",
  data() {
    return {
      diary: {
        name: null,
        cost: null,
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      this.$emit("submit", this.diary);
    },
  },
};
</script>
