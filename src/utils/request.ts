import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  request_id?: string;
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (data.code !== 0) {
      // 2001 = 未授权/Token 过期，跳到登录页
      if (data.code === 2001) {
        localStorage.removeItem('token');
        window.location.replace('/login');
        return Promise.reject(new Error('unauthorized'));
      }
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.replace('/login');
      return Promise.reject(error);
    }
    message.error(error.message || '网络错误');
    return Promise.reject(error);
  },
);

const request = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    instance.get<ApiResponse<T>>(url, { params }).then((r) => r.data),
  post: <T>(url: string, data?: unknown) =>
    instance.post<ApiResponse<T>>(url, data).then((r) => r.data),
};

export default request;
