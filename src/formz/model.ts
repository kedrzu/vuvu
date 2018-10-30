import Vue from 'vue';

import * as jsep from 'jsep';
const jsepParse = require('jsep');

interface ModelBase {
    $errors?: ModelErrors;
}

export interface ModelError {
    key: string;
    message: string;
}

export interface ModelErrors {
    [key: string]: string[];
}

export function hasErrors<T extends object>(model: T) {
    let errorsAll = model && (model as ModelBase).$errors;
    return errorsAll && Object.keys(errorsAll).length > 0;
}

export function getErrorsForProp<T extends object>(model: T, prop: string): string[] {
    let errorsAll = model && (model as ModelBase).$errors;
    let errorsForKey = prop != null && errorsAll && errorsAll[prop.toString()];

    return errorsForKey || [];
}

export function getErrors(model: object) {
    return (model as ModelBase).$errors || Vue.set(model, '$errors', {});
}

export function clearErrorsForProp<T extends object>(model: T, prop: string): void {
    let errorsAll = model && (model as ModelBase).$errors;
    if (errorsAll) {
        Vue.delete(errorsAll, prop);
    }
}

export function clearAllErrors<T extends object | object[]>(model: T): void {
    if (!model) {
        return;
    }

    if (Array.isArray(model)) {
        for (let item of model) {
            clearAllErrors(item);
        }
    } else if (model instanceof Object) {
        (model as ModelBase).$errors = null;

        for (let prop of Object.keys(model)) {
            let value = model[prop];
            clearAllErrors(value);
        }
    }
}

export function setErrors<T extends object>(model: T, errors: ModelError[]): void {
    clearAllErrors(model);

    if (errors && errors.length) {
        for (let error of errors) {
            let expression = jsepParse(error.key);
            addErrorForExpression(model, expression, error.message);
        }
    }
}

function addErrorForExpression<T extends object>(model: T, expr: jsep.Expression, message: string) {
    if (!expr) {
        return;
    }

    switch (expr.type) {
        case 'MemberExpression': {
            let memberExpr = expr as jsep.MemberExpression;
            let childModel = findChildModel(model, memberExpr.object);

            switch (memberExpr.property.type) {
                case 'Identifier': {
                    let propertyExpr = memberExpr.property as jsep.Identifier;
                    addErrorForKey(childModel, propertyExpr.name, message);
                    return;
                }
                case 'Literal': {
                    let literalExpr = memberExpr.property as jsep.Literal;
                    addErrorForKey(childModel, literalExpr.value.toString(), message);
                    return;
                }
            }
        }

        case 'Identifier': {
            let identifier = expr as jsep.Identifier;
            let child = model[identifier.name];

            if (child instanceof Object) {
                addErrorForKey(child, '', message);
            } else {
                addErrorForKey(model, identifier.name, message);
            }

            return;
        }
    }
}

function addErrorForKey<T extends ModelBase>(model: T, key: string, message: string) {
    let errors = getErrors(model);
    let forKey = errors[key] || Vue.set(errors, key, []);

    forKey.push(message);
}

function findChildModel<T extends ModelBase>(model: T, expr: jsep.Expression): ModelBase {
    if (!expr) {
        return null;
    }

    switch (expr.type) {
        case 'Identifier': {
            let identifier = expr as jsep.Identifier;
            let childModel = model[identifier.name];

            if (!childModel) {
                childModel = {};
                Vue.set(model, identifier.name, childModel);
            }

            return childModel;
        }
        case 'MemberExpression': {
            let memberExpr = expr as jsep.MemberExpression;
            let childModel = findChildModel(model, memberExpr.object);

            return findChildModel(childModel, memberExpr.property);
        }
    }
}