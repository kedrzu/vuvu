import Vue from 'vue';
import * as types from 'vuvu/types';

import { Property, Type } from './decorators';

import * as jsep from 'jsep';
const jsepParse = require('jsep');

export interface ValidationError {
    key: string;
    message: string;
}

export interface ModelValidationErrors {
    [key: string]: string[];
}

@Type()
export class Model {
    @Property({ json: false })
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
                let expression = jsepParse(error.key);
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
