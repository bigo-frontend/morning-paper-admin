import { cloneDeep } from 'lodash';

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTimeStamp(timeStamp, format) {
  let showTime = '';
  if (timeStamp) {
    const date = new Date(+timeStamp);
    const year = date.getFullYear();
    const month = `0${(date.getMonth() + 1)}`.substr(-2);
    const day = `0${date.getDate()}`.substr(-2);
    const hours = `0${date.getHours()}`.substr(-2);
    const min = `0${date.getMinutes()}`.substr(-2);
    const sec = `0${date.getSeconds()}`.substr(-2);
    // 格式化
    showTime = format
      .replace('yyyy', year)
      .replace('mm', month)
      .replace('dd', day)
      .replace('hh', hours)
      .replace('mm', min)
      .replace('ss', sec);
  }
  return showTime;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  );
}

/**
 * @example 1000000 => 1000,000
 * filter 将数值格式化成标准的USA格式
 * @param {*} number 数值
 * @param {*} separator 分隔符
 */
export function formatUSANumber(number, separator = ',') {
  const [interger, decimal] = `${number}`.split('.');
  const formatted = `${interger}`.replace(/(?!^)(?=(\d{3})+$)/g, separator);

  return decimal ? `${formatted}.${decimal}` : formatted;
}

export function formatRate(num) {
  return numMulti(num, 100) + '%';
}

export function numMulti(num1, num2) {
  let baseNum = 0;
  baseNum += num1.toString().split('.')[1] ? num1.toString().split('.')[1].length : 0;
  baseNum += num2.toString().split('.')[1] ? num2.toString().split('.')[1].length : 0;
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
}

export function getPriceDetails(price, currency) {
  let unit = '';
  let integer = '';
  let decimal = '';
  switch (currency) {
    case 'RUB': unit = ' руб.';
      break;
    case 'CNY': unit = '¥';
      break;
    default: unit = '$';
  }

  const arr = `${price}`.split('.');
  const tempInteger = arr[0] || 0;
  switch (currency) {
    case 'RUB': {
      integer = `${formatUSANumber(tempInteger, ' ')}`;
      break;
    }
    case 'CNY': {
      integer = `${formatUSANumber(tempInteger, ',')}`;
      break;
    }
    default: { // $
      integer = `${formatUSANumber(tempInteger, ',')}`;
    }
  }
  const temp = arr[1];
  decimal = temp ? `${temp}0`.slice(0, 2) : '00';

  switch (currency) {
    case 'RUB': {
      decimal = `,${decimal}`;
      break;
    }
    case 'CNY': {
      decimal = `.${decimal}`;
      break;
    }
    default: { // $
      decimal = `.${decimal}`;
    }
  }
  return {
    unit,
    integer,
    decimal
  };
}

/**
 * 移除对象中的 falsy 属性
 * @param {Object} obj
 */
export function removeFalsy(obj = {}) {
  const result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        const res = removeFalsy(obj[key]);
        if (Object.keys(res).length > 0) {
          result[key] = res;
        }
        continue;
      }

      if (obj[key] !== undefined && obj[key] !== null) {
        result[key] = obj[key];
      }
    }
  }

  return result;
}
/**
 * 包裹promise
 * @param {Promise} promise
 */
export const awaitWrap = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => {
      console.log(err);
      return [err, null];
    });
};

/**
 * 除去空参数
 * @param {object} obj
 */
export const removeEmptyProp = obj => {
  const newObj = {};
  for (const p in obj) {
    if (obj[p] === null || obj[p] === undefined) {
      continue;
    }
    if (
      !(obj[p] instanceof Date) &&
      typeof obj[p] === 'object' &&
      Object.keys(obj[p]).length === 0
    ) {
      // 非日期，且为空对象或空数组
      continue;
    }
    if (obj[p] === 0 || obj[p]) {
      // 不为空字符串，null，undefined，可以为0
      newObj[p] = obj[p];
    }
  }
  return newObj;
};

// 深度优先遍历
export const traverseDF = function(list = [], callback) {
  const forest = cloneDeep(list);
  const stack = [];
  let found = false;
  stack.unshift(...forest);
  let currentNode = stack.shift();
  while (!found && currentNode) {
    found = callback(currentNode) === true;
    if (currentNode.children) {
      stack.unshift(...currentNode.children.map(item => ({ ...item, parent: currentNode })));
    }
    currentNode = stack.shift();
  }
  const path = [];

  if (!currentNode) {
    return { node: null, path: [] };
  } else {
    path.unshift(currentNode);
    let parent = currentNode.parent;
    while (parent) {
      path.unshift(parent);
      parent = parent.parent;
    }
    return { node: currentNode, path };
  }
};
