var jam = {
    "packages": [
        {
            "name": "backbone-events",
            "location": "jam/backbone-events",
            "main": "backbone-events.js"
        }
    ],
    "version": "0.2.8",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}