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
})
