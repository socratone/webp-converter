const { ipcRenderer } = require('electron');

Vue.component('format', {
  template: `
    <main>
      <h2>target</h2>
      <input type="radio" id="webp" checked />
      <label for="webp">wepb</label>
      <h2>quality</h2>
      <input type="number" v-model.number="quality" />
      <h2>image file</h2>
      <input 
        id="file" 
        type="file" 
        accept="image/png, image/jpeg"
        v-on:change="selectImageFile"
      />
      <h2>preview</h2>
      <img v-if="url" v-bind:src="url" alt="preview image" />
      <button class="convert-button" v-on:click="submit">변 환</button>
    </main>`,
  data: function () {
    return {
      url: '',
      fileName: '',
      filePath: '',
      quality: '75'
    }
  },
  methods: {
    selectImageFile: function ({ target }) {
      if (target.files && target.files[0]) {
        this.fileName = target.files[0].name;
        this.filePath = document.getElementById('file').files[0].path; // Electron에서만 접근 가능
        const reader = new FileReader();
        reader.onload = ({ target }) => {
          this.url = target.result;
        }
        reader.readAsDataURL(target.files[0]);
      } else {
        this.url = '';
      }
    }, 
    submit: function () {
      if (!this.url) return alert('파일을 선택해주세요.');

      ipcRenderer.on('convert-result', (event, arg) => {
        if (arg.error) alert(arg.error);
        else console.log('Images optimized')
      });

      ipcRenderer.send('image-file-converter', { 
        path: this.filePath,
        quality: this.quality
      });
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