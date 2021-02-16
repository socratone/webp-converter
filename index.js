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