import axios from 'axios';
import { Message } from 'element-ui';
import { login } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    const { data = {}} = config;
    const { requestConfig = {}} = data;
    if (config.data && config.data.requestConfig) {
      delete config.data.requestConfig;
    }
    config.requestConfig = { ...(config.requestConfig || {}), ...requestConfig };
    config.headers = config.headers || {};
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 兼容文件下载
    if (response.config.responseType === 'blob') {
      return response;
    }

    const requestConfig = response.config.requestConfig || {};
    const res = response.data;

    if (response.config.url.includes(process.env.VUE_APP_CDN_API)) {
      return [null, res];
    }

    // if the custom code is not 20000, it is judged as an error.
    if (!res.success) {
      if (!requestConfig.isHandleSelf || res.code === -1) {
        Message({
          message: res.message || 'Error系统错误',
          type: 'error',
          duration: 5 * 1000
        });
      }
      if (requestConfig && requestConfig.isHandleSelf && res.code !== -1) {
        return [res, null];
      }
      return [res, null];
    } else {
      return [null, res];
    }
  },
  error => {
    console.log('err' + error); // for debug
    if (error.response.status === 401) {
      Message({
        message: '用户登录状态已失效',
        type: 'error',
        duration: 5 * 1000
      });
      login();
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return [error, null];
  }
);

export default service;
