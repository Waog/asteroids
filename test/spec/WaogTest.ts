/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="TeddyMocks/TeddyMocks.ts" />

/**
 * Globals
 */
var expect = chai.expect;
var mochaBeforeEach = beforeEach;

chai.config.includeStack = true;

module WaogTest {

    class Test {
        public static METHOD_PREFIX = 'Test';

        public endsWith = (str, suffix) => {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
    }

    export class ModuleTest extends Test {
        constructor(private moduleName: string, private theModule) {
            super();
        }

        public run = () => {
            describe(this.moduleName + ':', this.runAllClasses);
        }

        private runAllClasses = () => {
            for (var clazzName in this.theModule) {
                if (this.endsWith(clazzName, Test.METHOD_PREFIX)) {
                    var objectOfModulesClass = new this.theModule[clazzName]();
                    if (objectOfModulesClass instanceof ClassTest) {
                        (<ClassTest> objectOfModulesClass).run(clazzName);
                    }
                }
            }
        }
    }

    export class ClassTest extends Test {

        public run = (clazzName: string) => {
            describe(clazzName, this.runAllProperties);
        }

        private runAllProperties = () => {
            for (var property in this) {
                this.handlePropertyIfHook(property);
            }
            for (var property in this) {
                this.callPropertyIfTestMethod(property);
            }
        }

        private handlePropertyIfHook = (property: any) => {
            if (typeof property == 'string' && typeof this[property] == 'function') {
                var functionName = <string> property;
                if (functionName == 'beforeEach') {
                    mochaBeforeEach(this[functionName]);
                }
            }
        }

        private callPropertyIfTestMethod = (property: any) => {
            if (typeof property == 'string' && typeof this[property] == 'function') {
                var functionName = <string> property;
                if (this.endsWith(functionName, Test.METHOD_PREFIX)) {
                    describe('.' + functionName + '()', this[functionName]);
                }
            }
        }

        public beforeEach = (done?: () => void) => {
            done();
        }
    }
}