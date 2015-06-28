/// <reference path="../tsd.d.ts" />

// TODO: the only purpose of this class is to provide an interface for the tests.
// remove this file as soon as test work properly and are used on production files.
export class SimpleMath {

    constructor() {
    }

    public addTwoNumbers(a: number, b: number): number {
        return a + b;
    }
}
