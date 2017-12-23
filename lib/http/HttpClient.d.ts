import * as axios from 'axios';
import * as types from 'vuvu/types';
export declare class HttpClient {
    constructor(path?: string);
    readonly path: string;
    readonly headers: types.Dictionary<string | number>;
    get<T>(path: string, config?: axios.AxiosRequestConfig): Promise<T>;
    post<T>(path: string, config?: axios.AxiosRequestConfig): Promise<T>;
    request<T>(config: axios.AxiosRequestConfig): Promise<T>;
}
