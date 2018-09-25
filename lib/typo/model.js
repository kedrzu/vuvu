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
import Vue from 'vue';
import { Property, Type } from './decorators';
const jsepParse = require('jsep');
let Model = Model_1 = class Model {
    constructor() {
        this.$errors = null;
    }
    $clearErrors() {
        this.$errors = null;
        for (let prop of Object.keys(this)) {
            let value = this[prop];
            if (value instanceof Model_1) {
                value.$clearErrors();
            }
        }
    }
    $clearError(key) {
        let errors = this.$errors;
        if (errors) {
            Vue.delete(errors, key);
        }
    }
    $getErrors(key) {
        let errors = key != null && this.$errors && this.$errors[key.toString()];
        return errors || [];
    }
    $setErrors(errors) {
        this.$clearErrors();
        if (errors && errors.length) {
            for (let error of errors) {
                let expression = jsepParse(error.key);
                this.$$addErrorForExpression(expression, error.message);
            }
        }
    }
    $$addErrorForExpression(expr, message) {
        if (!expr) {
            return;
        }
        switch (expr.type) {
            case 'MemberExpression': {
                let memberExpr = expr;
                let childModel = this.$$findChildModel(memberExpr.object);
                switch (memberExpr.property.type) {
                    case 'Identifier': {
                        let propertyExpr = memberExpr.property;
                        childModel.$$addErrorForKey(propertyExpr.name, message);
                        return;
                    }
                    case 'Literal': {
                        let literalExpr = memberExpr.property;
                        childModel.$$addErrorForKey(literalExpr.value.toString(), message);
                        return;
                    }
                }
            }
            case 'Identifier': {
                let identifier = expr;
                let child = this[identifier.name];
                if (child instanceof Model_1) {
                    child.$$addErrorForKey('', message);
                }
                else {
                    this.$$addErrorForKey(identifier.name, message);
                }
                return;
            }
        }
    }
    $$addErrorForKey(key, message) {
        let errors = this.$errors || (this.$errors = {});
        let forKey = errors[key] || (errors[key] = []);
        forKey.push(message);
    }
    $$findChildModel(expr) {
        if (!expr) {
            return null;
        }
        switch (expr.type) {
            case 'Identifier': {
                let identifier = expr;
                let model = this[identifier.name];
                return model instanceof Model_1 ? model : null;
            }
            case 'MemberExpression': {
                let memberExpr = expr;
                let model = this.$$findChildModel(memberExpr.object);
                return model && model.$$findChildModel(memberExpr.property);
            }
        }
    }
    $get(key) {
        return this[key];
    }
    $set(key, value) {
        Vue.set(this, key, value);
    }
    $assign(values) {
        for (let key of Object.keys(values)) {
            Vue.set(this, key, values[key]);
        }
    }
    $submit(fcn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Promise.resolve(fcn());
            }
            catch (e) {
                this.$setErrors(e);
                throw e;
            }
        });
    }
};
__decorate([
    Property({ json: false }),
    __metadata("design:type", Object)
], Model.prototype, "$errors", void 0);
Model = Model_1 = __decorate([
    Type()
], Model);
export { Model };
var Model_1;
//# sourceMappingURL=model.js.map