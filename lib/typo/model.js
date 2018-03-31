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
import * as typo from 'vuvu/typo';
const jsepParse = require('jsep');
function enumerable(value) {
    return (target, propertyKey, descriptor) => {
        descriptor.enumerable = value;
    };
}
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
    typo.Property({ json: false }),
    __metadata("design:type", Object)
], Model.prototype, "$errors", void 0);
Model = Model_1 = __decorate([
    typo.Type()
], Model);
export { Model };
function addErrorToModel(model, expr, error) {
    if (!model || !expr) {
        return null;
    }
    switch (expr.type) {
        case 'MemberExpression':
            let memberExpr = expr;
            let childModel = findChildModel(model, memberExpr.object);
            return addErrorToModel(childModel, memberExpr.property, error);
        case 'Identifier':
            return model.$errors || (model.$errors = {});
    }
}
function findChildModel(model, expr) {
    switch (expr.type) {
        case 'MemberExpression':
            let memberExpr = expr;
            return findChildModel(model, memberExpr.object);
        case 'Identifier':
            let identifier = expr;
            return model[identifier.name];
    }
}
var Model_1;
// function tokenizeExpression(expression: string): string[] {
//     const tokens = [] as string[];
//     const memberMode = 1;
//     const dictMode = 2;
//     const arrayMode = 2;
//     let currentMode = memberMode;
//     let lastTokenIndex = 0;
//     for (let i = 0; i < expression.length; i++) {
//         let char = expression[i];
//         if (currentMode === dictMode && isQuotationMark(char)) {
//         }
//         if (char === '.') {
//             tokenizeOne(i);
//             currentMode = memberMode;
//             i++;
//             lastTokenIndex = i;
//         } else if (char === '[') {
//             tokenizeOne(i);
//             let nextChar = expression[i + 1];
//             // tslint:disable-next-line:quotemark
//             if (nextChar === "'" || nextChar === '"') {
//                 currentMode = dictMode;
//                 i += 2;
//             } else {
//                 currentMode = arrayMode;
//                 i++;
//             }
//         }
//     }
//     function tokenizeOne(i: number) {
//         let token = expression.substring(lastTokenIndex, i);
//         tokens.push(token);
//     }
//     function isQuotationMark(char: string) {
//         // tslint:disable-next-line:quotemark
//         return nextChar === "'" || nextChar === '"';
//     }
//     return tokens;
// }
//# sourceMappingURL=model.js.map