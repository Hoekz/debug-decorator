
const isClass = (fn) => typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn));

const logger = {
    prefix: [],
    log: (msg, ...args) => console.log(logger.prefix.join('') + msg, ...args)
};

const wrap = function (name, fn, config) { return function (...args) {
    let result, error, returned = false, threw = false;

    if (config.events.includes('enter')) logger.log(`entering ${name}`);
    if (config.args) logger.log(`${name} called with:`, ...args);

    logger.prefix.push(config.indent);
    try {
        result = fn.apply(this, args);
        returned = true;
    } catch(e) {
        threw = true;
        if (config.events.includes('throw')) logger.log(`error thrown in ${name}`);
        error = e;
    }
    logger.prefix.pop();

    if (config.events.includes('exit')) logger.log(`exiting ${name}`);
    if (config.return && returned) logger.log(`${name} returned:`, result);
    if (config.throw && threw) logger.log(`${name} threw:`, error);

    if (!threw || config.swallow) {
        return result;
    }

    throw error;
};};

const debug = (config) => {
    config = Object.assign({
        events: [],
        args: false,
        return: false,
        throw: false,
        swallow: false,
        onlyConstructor: false,
        indent: '\t',
    }, config);

    return function(target, name = '', bind = false) {
        if (isClass(target)) {
            const className = name || target.name || '';

            return class DebuggerClass extends target {
                __className__ = className;

                constructor(...args) {
                    if (config.events.includes('construct')) logger.log(`entering constructor of '${className}'`);
                    if (config.args) logger.log(`'${className}' being constructed with:`, ...args);

                    try {
                        super(...args);
                    } catch (e) {
                        if (config.events.includes('throw')) logger.log(`error thrown while constructing '${className}'`);
                        if (config.throw) logger.log(`constructing of '${className}' threw:`, e);
                        throw e;
                    }

                    if (config.events.includes('construct')) logger.log(`exiting constructor of '${className}'`);
                    
                    if (!config.onlyConstructor) {
                        for (const method of Object.getOwnPropertyNames(target.prototype)) {
                            if (method !== 'constructor') {
                                this[method] = wrap(`${className}.${method}`, this[method], config);
                            }
                        }
                    }
                }
            };
        }

        if (typeof target === 'function') {
            const fnName = name || '';
            const fn = wrap(fnName, target, config);

            if (bind) {
                return fn.bind(bind);
            }

            return fn;
        }

        if (typeof target === 'object' && !(target instanceof Array)) {
            const clone = Object.assign({}, target);

            for (const field in target) {
                clone[field] = debug(config)(target[field], field, bind ? target : null);
            }

            return clone;
        }

        return target;
    }
};

debug.full = Object.freeze({
    events: ['enter', 'exit', 'throw', 'construct'],
    args: true,
    return: true,
    throw: true,
    onlyConstructor: false,
});

export default debug;
