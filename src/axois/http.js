import axios from 'axios';
import qs from 'qs';
import {
  Loading,
  Toast,
} from 'vue-ydui/dist/lib.rem/dialog';

// 请求超时时间
axios.defaults.timeout = 12000;
// 请求的baseurl
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.Accept = 'application/json';
// axios 请求拦截器
axios.interceptors.request.use(
  (config) => {
    Loading.open('数据加载中');
    return config;
  },
);
// axios response拦截器
axios.interceptors.response.use(
  (response) => {
    Loading.close();
    if (response.status === 200 && response.data.status === 1) {
      return Promise.resolve(response);
    }
    Toast({
      mes: response.data.msg,
      icon: 'error',
      timeout: 2000,
    });
    return Promise.reject(response);
  },
  (error) => {
    Loading.close();
    const responseCode = error.response.status;
    switch (responseCode) {
      // 401：未登录
      case 401:
        break;
        // 404请求不存在
      case 404:
        Toast({
          mes: '网络请求不存在',
          icon: 'error',
          timeout: 2000,
        });
        break;
      default:
        Toast({
          mes: error.response.data.msg,
          icon: 'error',
          timeout: 2000,
        });
    }
    return Promise.reject(error.response);
  },
);


/**
 * 封装get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params = {}) {
  Object.assign(params, { p: 'w', pid: 26, language: 1 });
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
  // 或者return axios.get();
}
/**
* post方法，对应post请求
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
function post(url, params) {
  Object.assign(params, { p: 'w', pid: 26, language: 1 });
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
  //  或者return axios.post();
}


export { get, post };
