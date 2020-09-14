# Debug Decorator

A decorator that allows you to attach various conditions under which to log.

## Options

All logging turned on for a function, class, or object with methods (`debug.full`):

```js
{
    events: ['enter', 'exit', 'throw', 'construct'],
    args: true,
    return: true,
    throw: true,
    onlyConstructor: false,
}
```

No options are required, but here is the full list of possibilities.

 - `events: List[String]`: Add particular events to log for.
    - `enter`: when a function starts running.
    - `exit`: when a function stops running.
    - `throw`: when a function encounters an error.
    - `construct`: (class only) when a new instance of a class is created (logs both entering and exiting the constructor).
 - `args: Boolean`: display the arguments that were passed to a function.
 - `return: Boolean`: display the result returned from a function.
 - `throw: Boolean`: display the error that was thrown by a function.
 - `swallow: Boolean`: do not forward a thrown error, instead return `undefined` to the caller.
 - `onlyConstructor: Boolean`: (class only) only decorate the constructor of the class, none of the associated methods.
 - `indent: String`: In the cases were decorated functions call one another, the indent string is prepended to indicate the call stack size. Defaults to `\t`.

In addition, when decorating a function, you can pass in a name for the function to be logged as, as well as what should be used to represent `this`.

When decorating an object, a clone of the object is created and you can choose to `bind` the object to each of the discovered methods.
