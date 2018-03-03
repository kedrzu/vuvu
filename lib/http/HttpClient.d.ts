import * as axios from 'axios';
import * as types from 'vuvu/types';
export declare class HttpClient {
    path: string;
    readonly headers: types.Dictionary<string | number>;
    get<T = any>(config?: axios.AxiosRequestConfig): Promise<T>;
    post<T = any>(config: axios.AxiosRequestConfig): Promise<T>;
    put<T = any>(config: axios.AxiosRequestConfig): Promise<T>;
    delete<T = any>(config: axios.AxiosRequestConfig): Promise<T>;
    request<T = any>(config: axios.AxiosRequestConfig): Promise<T>;
}
