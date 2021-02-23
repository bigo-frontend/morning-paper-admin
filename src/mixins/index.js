export const calcTableMaxHeight = {
  data() {
    return {
      maxHeight: 0
    };
  },

  mounted() {
    this.calcTableMaxHeight();
  },

  methods: {
    calcTableMaxHeight() {
      const $appMain = document.querySelector('.app-main');

      this.maxHeight = $appMain.clientHeight - this.$el.clientHeight;
    }
  }
};
