const { ipcRenderer } = require('electron');

Vue.component('format', {
  template: `
    <main>
      <header class="main__header">
        <div>
          <h2>format</h2>
          <span>
            <input type="radio" id="webp" checked />
            <label for="webp">wepb</label>
          </span>
        </div>
        <div>
          <h2>quality</h2>
          <input type="number" v-model.number="quality" />
        </div>
        <div>
          <h2>image file</h2>
          <input
            id="file"
            type="file"
            accept="image/png, image/jpeg"
            v-on:change="selectImageFile"
          />
        </div>
      </header>
      <h2>preview</h2>
      <img v-if="url" v-bind:src="url" class="main__image" alt="preview image" />
      <div v-else class="main__blank-image"></div>
      <button class="convert-button" v-on:click="submit">변 환</button>
    </main>`,
  data: function () {
    return {
      url: '',
      fileName: '',
      filePath: '',
      quality: 75
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
      if (this.quality < 0 || this.quality > 100) {
        return alert('Quality는 0에서 100 사이의 값을 넣어주세요.')
      }

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

Vue.component('about', {
  template: `
    <main>
      <h2>license</h2>
      <p>electron :</p>
      <p>
        <a href="https://www.electronjs.org/" target="_blank">
          https://www.electronjs.org/
        </a>
      </p>
      <p>imagemin :</p> 
      <p>
        <a href="https://github.com/imagemin/imagemin#readme" target="_blank">
          https://github.com/imagemin/imagemin#readme
        </a>
      </p>
      <p>imagemin-webp :</p>
      <p>
        <a href="https://github.com/imagemin/imagemin-webp" target="_blank">
          https://github.com/imagemin/imagemin-webp
        </a>
      </p>
    </main>`,
  data: function () {
    return {
      url: '',
      fileName: '',
      filePath: '',
      quality: 75
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
      if (this.quality < 0 || this.quality > 100) {
        return alert('Quality는 0에서 100 사이의 값을 넣어주세요.')
      }

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