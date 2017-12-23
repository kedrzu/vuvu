var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as axios from 'axios';
import * as ioc from 'vuvu/ioc';
let HttpClient = class HttpClient {
    constructor(path) {
        this.headers = {};
        this.path = path || '';
        // remove trailing slash
        if (this.path.endsWith('/')) {
            this.path = this.path.substr(0, this.path.length - 1);
        }
    }
    get(path, config) {
        config = config || {};
        config.method = 'GET';
        config.url = path;
        return this.request(config);
    }
    post(path, config) {
        config = config || {};
        config.method = 'POST';
        config.url = path;
        return this.request(config);
    }
    request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            config.baseURL = this.path;
            config.headers = Object.assign({}, this.headers, config.headers);
            let result = yield axios.default.request(config);
            return result.data;
        });
    }
};
HttpClient = __decorate([
    ioc.injectable(),
    __metadata("design:paramtypes", [String])
], HttpClient);
export { HttpClient };
//# sourceMappingURL=HttpClient.js.map