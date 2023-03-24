export function catchError() {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalFunc = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalFunc.apply(this, args);
            } catch (e: any) {
                console.log(e.message);
            }
        };
        return descriptor;
    };
}