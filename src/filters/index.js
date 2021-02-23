/* eslint-disable eqeqeq */
/* eslint-disable no-prototype-builtins */
import { formatRate, parseTime } from '@/utils';

export default {
  install(Vue) {
    Vue.filter('formatRate', formatRate);
    Vue.filter('time', parseTime);
    Vue.filter('formatDicts', function formatDicts(val, options = []) {
      const item = options.find(item => {
        if (item.hasOwnProperty('code')) {
          return item.code == val;
        } else {
          return item.value == val;
        }
      }) || {};
      return item.desc || '';
    });
  }
};
