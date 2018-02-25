import Vue from 'vue';
import * as ioc from 'vuvu/ioc';
import * as types from 'vuvu/types';
import * as typo from 'vuvu/typo';

import * as jsep from 'jsep';

export interface ValidationError {
    key: string;
    message: string;
}

export interface ModelValidationErrors {
    [key: string]: string[];
}

function enumerable(value: boolean) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

@typo.Type()
export class Model {
    @typo.Property({ json: false })
    public $errors: ModelValidationErrors = null;

    public $clearErrors() {
        this.$errors = null;

        for (let prop of Object.keys(this)) {
            let value = this[prop];
            if (value instanceof Model) {
                value.$clearErrors();
            }
        }
    }

    public $clearError(key: string) {
        let errors = this.$errors;
        if (errors) {
            Vue.delete(errors, key);
        }
    }

    public $getErrors(key: string): string[] {
        let errors = key != null && this.$errors && this.$errors[key.toString()];
        return errors || [];
    }

    public $setErrors(errors: ValidationError[]) {
        this.$clearErrors();

        if (errors && errors.length) {
            for (let error of errors) {
                let expression = jsep(error.key);
                this.$$addErrorForExpression(expression, error.message);
            }
        }
    }

    private $$addErrorForExpression(expr: jsep.Expression, message: string) {
        if (!expr) {
            return;
        }

        switch (expr.type) {
            case 'MemberExpression': {
                let memberExpr = expr as jsep.MemberExpression;
                let childModel = this.$$findChildModel(memberExpr.object);

                switch (memberExpr.property.type) {
                    case 'Identifier': {
                        let propertyExpr = memberExpr.property as jsep.Identifier;
                        childModel.$$addErrorForKey(propertyExpr.name, message);
                        return;
                    }
                    case 'Literal': {
                        let literalExpr = memberExpr.property as jsep.Literal;
                        childModel.$$addErrorForKey(literalExpr.value.toString(), message);
                        return;
                    }
                }
            }

            case 'Identifier': {
                let identifier = expr as jsep.Identifier;
                let child = this[identifier.name];

                if (child instanceof Model) {
                    child.$$addErrorForKey('', message);
                } else {
                    this.$$addErrorForKey(identifier.name, message);
                }

                return;
            }
        }
    }

    private $$addErrorForKey(key: string, message: string) {
        let errors = this.$errors || (this.$errors = {});
        let forKey = errors[key] || (errors[key] = []);

        forKey.push(message);
    }

    private $$findChildModel(expr: jsep.Expression): Model {
        if (!expr) {
            return null;
        }

        switch (expr.type) {
            case 'Identifier': {
                let identifier = expr as jsep.Identifier;
                let model = this[identifier.name];

                return model instanceof Model ? model : null;
            }
            case 'MemberExpression': {
                let memberExpr = expr as jsep.MemberExpression;
                let model = this.$$findChildModel(memberExpr.object);
                return model && model.$$findChildModel(memberExpr.property);
            }
        }
    }

    public $get(key: string) {
        return this[key];
    }

    public $set(key: string, value: any) {
        Vue.set(this, key, value);
    }

    public $assign(values: types.Dictionary<any>) {
        for (let key of Object.keys(values)) {
            Vue.set(this, key, values[key]);
        }
    }

    public async $submit<TResult>(fcn: () => Promise<TResult> | TResult) {
        try {
            return await Promise.resolve(fcn());
        } catch (e) {
            this.$setErrors(e);
            throw e;
        }
    }
}

function addErrorToModel(
    model: Model,
    expr: jsep.Expression,
    error: string
): ModelValidationErrors {
    if (!model || !expr) {
        return null;
    }

    switch (expr.type) {
        case 'MemberExpression':
            let memberExpr = expr as jsep.MemberExpression;
            let childModel = findChildModel(model, memberExpr.object);
            return addErrorToModel(childModel, memberExpr.property, error);
        case 'Identifier':
            return model.$errors || (model.$errors = {});
    }
}

function findChildModel(model: Model, expr: jsep.Expression) {
    switch (expr.type) {
        case 'MemberExpression':
            let memberExpr = expr as jsep.MemberExpression;
            return findChildModel(model, memberExpr.object);
        case 'Identifier':
            let identifier = expr as jsep.Identifier;
            return model[identifier.name];
    }
}

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
