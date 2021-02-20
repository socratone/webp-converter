const { ipcRenderer } = require('electron');

Vue.component('format', {
  template: `
    <main>
      <header class="main__header">
        <div>
          <h2>format</h2>
          <span>
            <input type="radio" id="webp" checked />
            <label for="webp">WEBP</label>
          </span>
        </div>
        <div>
          <h2>quality</h2>
          <input type="number" v-model.number="quality" />
        </div>
        <div>
          <h2>width</h2>
          <input 
            class="widen"
            type="number" 
            v-model.number="width" 
            v-on:change="handleWidthChange"
            :disabled="width === 0"
          />
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
      <img 
        v-if="url" 
        v-bind:src="url" 
        class="main__image" 
        alt="preview image" />
      <div 
        v-else 
        class="main__blank-image" 
        @drop="dropImageFile" 
        @dragenter.prevent="dragEnterImage"
        @dragover.prevent
        @dragleave="dragLeaveImage"
      >
        이미지를 드래그해서 올려주세요.
      </div>
      <button 
        id="delete-button"
        class="button button--delete" 
        v-on:click="deleteImage"
        v-if="url"
      >
        지우기
      </button>
      <button 
        class="button button--convert" 
        v-on:click="submit"
      >
        변 환
      </button>
    </main>`,
  data: function () {
    return {
      url: '',
      fileName: '',
      filePath: '',
      quality: 75,
      width: 0,
      height: 0
    }
  },
  methods: {
    handleWidthChange: function ({ target }) {
      this.width = target.value; // width data 입력
      const image = document.querySelector('.main__image');
      image.width = target.value; // preview 이미지 수정
      this.height = image.height; // height data 입력
    },
    clearImageDataAfter: function (ms) {
      setTimeout(() => {
        this.url = '';
        this.fileName = '';
        this.filePath = '';
        this.width = 0;
        this.height = 0;
        document.getElementById('file').value = '';
      }, ms);
    },
    selectImageFile: function ({ target }) {
      if (target.files && target.files[0]) {
        this.fileName = target.files[0].name;
        this.filePath = target.files[0].path; // Electron에서만 접근 가능

        const reader = new FileReader();
        reader.onload = ({ target }) => {
          this.url = target.result;
          setTimeout(() => {
            const image = document.querySelector('.main__image');
            this.width = image.offsetWidth;
            this.height = image.offsetHeight;
          }, 0);
        }
        reader.readAsDataURL(target.files[0]);
      } else {
        this.url = '';
      }
    }, 
    dropImageFile: function (event) {
      let files = event.dataTransfer.files;
      this.fileName = files[0].name;
      this.filePath = files[0].path;
      document.getElementById('file').files = files;
      
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        this.url = target.result;
        setTimeout(() => {
          const image = document.querySelector('.main__image');
          this.width = image.offsetWidth;
          this.height = image.offsetHeight;
        }, 0);
      }
      reader.readAsDataURL(files[0]);
    },
    dragEnterImage: function ({ target }) {
      target.style.background = 'aliceblue';
      target.style.border = '1px dashed dodgerblue';
    },
    dragLeaveImage: function ({ target }) {
      target.style.background = '';
      target.style.border = '';
    },
    deleteImage: function ({ target }) {
      target.style.transform = 'scale(0)';
      this.clearImageDataAfter(300);
    },
    submit: function () {
      if (!this.url || !this.fileName || !this.filePath) {
        return alert('파일을 선택해주세요.');
      }

      if (this.quality < 0 || this.quality > 100) {
        return alert('Quality는 0에서 100 사이의 값을 넣어주세요.');
      }

      if (this.width <= 0) return alert('Width는 0보다 커야 합니다.');

      ipcRenderer.on('convert-result', (event, arg) => {
        if (arg.error) alert(arg.error);
        else {
          console.log('Images optimized');
          const deleteButton = document.getElementById('delete-button');
          deleteButton.style.transform = 'scale(0)';
          this.clearImageDataAfter(300);
        }
      });

      ipcRenderer.send('image-file-converter', { 
        path: this.filePath,
        quality: this.quality, 
        width: this.width,
        height: this.height
      });
    }
  }
});

Vue.component('about', {
  template: `
    <main>
      <h2>license</h2>
      <p>vuejs :</p>
      <p>
        <a href="https://vuejs.org/" target="_blank">
          https://vuejs.org/
        </a>
      </p>
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
    </main>`
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