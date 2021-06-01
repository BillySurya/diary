<template>
  <div>
    <div>
      <header>
        <slot name="header">
          <div>
            Tambah Entri
          </div>
        </slot>
        <div>
          <button
            type="button"
            @click="close"
          >
            x
          </button>
        </div>
      </header>

      <section>
        <slot name="body">
          <div>
            <label for="name">Nama</label>
            <input name="name" type="text" v-model="diary.name">
          </div>
          <div>
            <label for="cost">Harga</label>
            <input name="cost" type="number" v-model="diary.cost">
          </div>
        </slot>
       </section>

      <footer>
        <button
          type="button"
          @click="close"
        >
          Batal
        </button>
         <button
          type="button"
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
    name: 'DiaryModal',
    data () {
      return {
        diary: {
          name: null,
          cost: null
        }
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      submit() {
        this.$emit('submit', this.diary);
      },
    },
  };
</script>
