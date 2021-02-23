import { getDictData } from '@/api/order';
export const trimEmptyProps = obj => {
  const newObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = obj[k];
    if (v !== undefined && v !== '') {
      newObj[k] = v;
    }
  }
  // todo
  return newObj;
};

export const fakeRequestDelay = (milis, data) => {
  return new Promise(res => {
    setTimeout(res, milis, data);
  });
};

export const stringifyDate = ({ date, timeZoneName }) => {
  if (isNaN(date.getTime())) return 'invalid';
  if (date.getTime() === 0) return '';
  // const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const myTimezone = 'Asia/Singapore';
  return (
    Intl.DateTimeFormat('zh-cn', {
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: timeZoneName || myTimezone
    })
      // todo
      .format(date)
      .replace(/\//g, '-') + `,${timeZoneName || myTimezone}`
  );
};

export const propKeyToLabel = key => {
  let words;
  words = key.split(/(\?<=[a-z])(\?=[A-Z])|(\?<=[A-Z])(\?=[A-Z][a-z])/);
  try {
    words = key.split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/);
  } catch (e) {
    console.warn(e);
  }

  words[0] = words[0][0].toUpperCase() + words[0].substr(1);
  return words.join(' ');
};

export const stringifyOptionValue = (v, opts) => {
  return opts?.find(e => e.value === v || e.value + '' === v + '')?.label;
};

export const queryDict = async function(code) {
  const [, data] = await getDictData(code);
  return data.map(e => ({
    label: e.desc,
    value: e.value
  }));
};

