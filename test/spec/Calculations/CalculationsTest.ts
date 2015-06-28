import CalculationsFile = require('../../../app/ts/Calculations/Calculations');
import SimpleMath = CalculationsFile.SimpleMath;
import WaogTestFile = require('../../lib/WaogTest');
import ClassTest = WaogTestFile.ClassTest;
import ModuleTest = WaogTestFile.ModuleTest;

module Calculations {

    export class SimpleMathTest extends ClassTest {

        positiveTest = () => {
            it('should never fail',(done) => {
                expect(1).to.equals(1);
                done();
            });
        }

        addTwoNumbersTest = () => {
            it('should return 2 for 1 + 1',(done) => {
                var simpleMath = new SimpleMath();
                expect(simpleMath.addTwoNumbers(1, 1)).to.equals(2);
                done();
            });
        }
    }
}
new ModuleTest("Calculations", Calculations).run();