import * as types from 'vuvu/types';
export interface ValidationError {
    key: string;
    message: string;
}
export interface ModelValidationErrors {
    [key: string]: string[];
}
export declare class Model {
    $errors: ModelValidationErrors;
    $clearErrors(): void;
    $clearError(key: string): void;
    $getErrors(key: string): string[];
    $setErrors(errors: ValidationError[]): void;
    private $$addErrorForExpression(expr, message);
    private $$addErrorForKey(key, message);
    private $$findChildModel(expr);
    $get(key: string): any;
    $set(key: string, value: any): void;
    $assign(values: types.Dictionary<any>): void;
    $submit<TResult>(fcn: () => Promise<TResult> | TResult): Promise<TResult>;
}
