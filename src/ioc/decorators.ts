export function inject() {
    return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
        console.log(this);
    };
}
