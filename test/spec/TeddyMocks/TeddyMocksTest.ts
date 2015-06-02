/// <reference path="../WaogTest.ts" />

module TeddyMocks {

    export class StubTest extends WaogTest.ClassTest {

        exampleTest = () => {
            it('should Stub objects like described in TeddyMocks readme',(done) => {
                var expected = 123;
                var stub = new TeddyMocks.Stub<GithubApi.GithubLogin>(GithubApi.GithubLogin);

                stub.stubs(m => m.getHello()).andReturns(null);
                expect(stub.object.getHello()).to.equal(null);

                expect(stub.assertsThat(s => s.getHello()).wasCalled()).to.be.true;
                done();
            });
        }
    }

    export class GlobalStubTest extends WaogTest.ClassTest {

        exampleTest = () => {
            it('should replace globals with GlobalStub',(done) => {
            
                //            var xmlhttp = new XMLHttpRequest();
                //            
                //            expect(xmlhttp.send).to.be.instanceOf(Function);
                //            
                //            TeddyMocks.GlobalOverride.createScope(() => {
                //
                //                var globalStub = new TeddyMocks.GlobalStub<XMLHttpRequest>("XMLHttpRequest");
                //                globalStub.stubs(s => s.send(undefined), false);
                //
                //                var request = new XMLHttpRequest();
                //                request.send(undefined);
                //
                //                expect(globalStub.assertsThat(s => s.send(undefined)).wasCalled()).to.equal(true);
                //            });
                done();
            });
        }
    }
}
new WaogTest.ModuleTest("TeddyMocks", TeddyMocks).run();