import axios, {AxiosRequestConfig} from 'axios';

const api = axios.create();

api.interceptors.response.use(response => {
    return response;
}, err => {
    console.log('Ошибка API', err);
    return Promise.reject(err);
});

export interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
}

export default api;