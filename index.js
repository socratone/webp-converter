Vue.component('format', {
  template: `
    <main>
      <h1>format</h1>
      <h2>target</h2>
      <input type="radio" id="webp" checked />
      <label for="webp">wepb</label>
      <h2>image file</h2>
      <input 
        id="file" 
        type="file" 
        accept="image/png, image/jpeg"
        v-on:change="selectImageFile"
      />
      <h2>preview</h2>
      <img v-if="url" v-bind:src="url" alt="preview image" />
    </main>`,
  data: function () {
    return {
      url: ''
    }
  },
  methods: {
    selectImageFile: function ({ target }) {
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          this.url = target.result;
        }
        reader.readAsDataURL(target.files[0]);
      } else {
        this.url = '';
      }
    }
  }
});

const app = new Vue({
  el: '#app',
  data: {
    tab: 'format'
  },
  methods: {
    select: function (tab) {
      this.tab = tab;
    }
  }
});