
/**
 * Marks object as having a type defined.
 */
export interface Typed extends Object {
    readonly $type: string;
    readonly $descriptor?: Descriptor;
}

/**
 * Describes a specific type of object
 */
export abstract class Descriptor<T extends Typed = Typed> {
    public readonly type: string;

    public make(props?: Partial<T>): T {
        let obj = {
            $type: this.type
        } as T;

        if (this.fill) {
            this.fill(obj);
        }

        Object.assign(obj, props);
        return obj;
    }

    protected fill?(obj: T): void;
}

export interface Descriptable<TDescriptor extends Descriptor> extends Typed {
    readonly $descriptor?: TDescriptor;
}
