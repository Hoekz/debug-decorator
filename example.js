import debug from './debugger';

class Tester {
    constructor(arg1, arg2) {
        this.first = arg1;
        this.second = arg2;
    }

    method1() {
        return 'called method1';
    }

    method2(arg1) {
        return this.method1(this.first, arg1);
    }

    method3(other) {
        return [this.first, this.second, other.first, other.second];
    }
}

const TesterDebug = debug(debug.full)(Tester);

const test = new TesterDebug('hello', 'world');
const other = new TesterDebug('hello', 'everyone');

test.method1(1, 2, 3);
test.method2(true, { blah: 'blah' });
test.method3(other);
