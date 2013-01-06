var expect = require("chai").expect;
var sinon  = require("sinon");
var Class  = require('../src/class.js');

describe("Class", function () {
    var Person, person;

    beforeEach(function () {
        Person = new Class;
        person = new Person;
    })

    it("should exist", function () {
        expect(Class).to.exist;
    })

    describe("when creating a class", function () {

        it("should extend prototypes", function () {
            Person.include({
                n: 5
            })
            var Person2 = new Class(Person);
            var person2 = new Person2;
            expect(person2.n).to.equal(5);
        })

        it("should add a unique CID GUID", function () {

            expect(person.cid.length).to.equal(36);
            expect(person.cid.match(/-/g).length).to.equal(4);
            expect(person.cid.match("4").length).to.be.above(0);
        })

        describe("Event System", function () {
            it("should mixin Backbone.Events into the prototype", function () {
                expect(typeof person.on).to.equal("function");
                expect(typeof person.off).to.equal("function");
                expect(typeof person.trigger).to.equal("function");
            })

            it("should trigger events with parameters", function () {
                var spy    = sinon.spy();
                person.on("test:case", spy);
                person.trigger("test:case", "test");
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, "test");
            })
        })

    })


    describe("methods", function () {

        describe("create method", function () {
            it("should return a new Class extending from the parent class", function () {
                Person.include({n: 5});
                var Person2 = Person.create({
                    getN: function () {
                        return this.n;
                    }
                });
                var person2 = new Person2;
                expect(person2.getN()).to.equal(5);
            })
        })

        describe("set method", function () {
            var spy, spy2, spy3, mSpy1, mSpy2;
            beforeEach(function () {
                person = new Person;
                spy = sinon.spy();   
                spy2 = sinon.spy();
                spy3 = sinon.spy();

                mSpy1 = sinon.spy();
                mSpy2 = sinon.spy();

                person.on("change", spy);
                person.on("change:test", spy2);
                person.on("change:spy3", spy3);
                person.set("test", 5);
            });

            it("should trigger change event when an attribute is set", function () {

                expect(spy.called).to.be.true;
                expect(person.test).to.equal(5);
                expect(spy2.called).to.be.true;
                expect(spy3.called).to.be.false;

                expect(spy.getCall(0).args[0]).to.equal("test");
                expect(spy2.getCall(0).args[0]).to.equal(5);
            })

            it("should trigger a mutate event when an attribute is set", function () {
                person = new Person;
                person.test = 5;
                person.on("mutate", mSpy1);
                person.set("test", 10);

                var args = mSpy1.getCall(0).args[0];

                expect(args.newValue).to.equal(10);
                expect(args.oldValue).to.equal(5);
                expect(args.key).to.equal("test");
            })

            it("shouldn't trigger a change event if silent is true", function () {
                var spy = sinon.spy();
                var spy2 = sinon.spy();
                var person = new Person;
                person.on("change:test", spy);
                person.on("mutate:test", spy2);
                person.set("test", 5, true);

                expect(spy.called).to.be.false;
                expect(spy2.called).to.be.false;
                expect(person.test).to.equal(5);
            })
        })

    })

})
