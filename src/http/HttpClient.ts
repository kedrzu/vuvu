import * as axios from 'axios';
import * as ioc from 'vuvu/ioc';
import * as types from 'vuvu/types';

@ioc.Injectable()
export class HttpClient {
    public path: string;
    public readonly headers: types.Dictionary<string | number> = {};

    public get<T = any>(config?: axios.AxiosRequestConfig): Promise<T> {
        config.method = 'GET';

        return this.request<T>(config);
    }

    public post<T = any>(config: axios.AxiosRequestConfig): Promise<T> {
        config.method = 'POST';

        return this.request<T>(config);
    }

    public put<T = any>(config: axios.AxiosRequestConfig): Promise<T> {
        config.method = 'PUT';

        return this.request<T>(config);
    }

    public delete<T = any>(config: axios.AxiosRequestConfig): Promise<T> {
        config.method = 'DELETE';

        return this.request<T>(config);
    }

    public async request<T = any>(config: axios.AxiosRequestConfig): Promise<T> {
        config.baseURL = this.path;
        config.headers = Object.assign({}, this.headers, config.headers);

        let result = await axios.default.request<T>(config);
        return result.data;
    }
}
