export function Singleton<T extends new (...args: any[]) => any>(target: T): T {
    let instance: T;
    const original = target;

    const fakeConstructor: any = function(...args: any[]) {
        if (!instance) {
            instance = Reflect.construct(original, args);
        }
        return instance;
    };

    fakeConstructor.prototype = original.prototype;

    return fakeConstructor;
}


/*
export function Singleton<T extends new (...args: any[]) => any>(ctr: T): T {
    let instance: T;

    return class {
        constructor(...args: any[]) {
            if (instance) {
                console.error('Got old instance...');
                return instance;
            }

            instance = new ctr(...args);
            return instance;
        }
    } as T
}
*/

/*
const Singleton = (): ClassDecorator => {
  let instance;

  return target => {
    const original = target;
    const f: any = function(...args) {
      if (!instance) {
        instance = Reflect.construct(original, args);
      }

      return instance;
    };

    f.prototype = original.prototype;

    return f;
  };
};
 */