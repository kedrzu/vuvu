import * as axios from 'axios';
import * as ioc from 'vuvu/ioc';
import * as types from 'vuvu/types';

@ioc.injectable()
export class HttpClient {
    constructor(path?: string) {
        this.path = path || '';

        // remove trailing slash
        if (this.path.endsWith('/')) {
            this.path = this.path.substr(0, this.path.length - 1);
        }
    }

    public readonly path: string;
    public readonly headers: types.Dictionary<string | number> = {};

    public get<T>(path: string, config?: axios.AxiosRequestConfig): Promise<T> {
        config = config || {};
        config.method = 'GET';
        config.url = path;

        return this.request<T>(config);
    }

    public post<T>(path: string, config?: axios.AxiosRequestConfig): Promise<T> {
        config = config || {};
        config.method = 'POST';
        config.url = path;

        return this.request<T>(config);
    }

    public async request<T>(config: axios.AxiosRequestConfig): Promise<T> {
        config.baseURL = this.path;
        config.headers = Object.assign({}, this.headers, config.headers);

        let result = await axios.default.request<T>(config);
        return result.data;
    }
}
