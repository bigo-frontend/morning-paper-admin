const DEFAULT_VALUE = '--';

export default {
  methods: {
    getValue(object, path) {
      if (object == null) return DEFAULT_VALUE;

      const keys = path.split('.');

      let res = object;

      for (let i = 0; i < keys.length; i++) {
        res = res[keys[i]];
        if (res == null) {
          return DEFAULT_VALUE;
        }
      }

      return res;
    }
  }
};
