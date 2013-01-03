var expect = require("chai").expect;
var Class  = require('../src/class.js');

describe("Class", function () {
    it("should exist", function () {
        expect(Class).to.exist;
    })

    it("should extend prototypes", function () {
        var Person = new Class;
        Person.include({
            n: 5
        })
        var Person2 = new Class(Person);
        var person2 = new Person2;
        expect(person2.n).to.equal(5);
    })

    describe("Create method", function () {

        it("should return a new Class extending from the parent class", function () {
            var Person  = new Class;
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
})
