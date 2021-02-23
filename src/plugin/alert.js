export default class Alert {
  static install(Vue) {
    const alert = (message, type) => {
      Vue.prototype.$message({
        message,
        type
      });
    };

    ['success', 'warning', 'info', 'error'].forEach((type) => {
      Vue.prototype[`$${type}`] = function(message) {
        if (typeof message === 'object') {
          message = message.message;
        }
        alert(message, type);
      };
    });
  }
}
