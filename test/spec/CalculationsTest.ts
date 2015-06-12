/// <reference path="../../app/ts/Calculations/Calculations.ts" />
/// <reference path="WaogTest.ts" />

module Calculations {

    export class SimpleMathTest extends WaogTest.ClassTest {

        positiveTest = () => {
            it('should never fail',(done) => {
                expect(1).to.equals(1);
                done();
            });
        }

        addTwoNumbersTest = () => {
            it('should return 2 for 1 + 1',(done) => {
                var simpleMath = new Calculations.SimpleMath();
                expect(simpleMath.addTwoNumbers(1, 1)).to.equals(2);
                done();
            });
        }
    }
}
new WaogTest.ModuleTest("Calculations", Calculations).run();