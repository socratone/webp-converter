const app = new Vue({
  el: '#app',
  data: {
    tab: 'format'
  },
  methods: {
    select: function (tab) {
      console.log('tab:', tab)
      console.log('this.tab:', this.tab)
      this.tab = tab;
    }
  }
});


// const app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!'
//   }
// });