var fs            = require("fs");
var FILE_ENCODING = "utf-8";
var EOL           = "\n";

function concat(options) {
    var file = options.src;
    var dest = options.dest;
    var dir  = dest.split("/").shift();

    if (!Array.isArray(file)) {
        file = [file];
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var out = file.map(function (filePath) {
        return fs.readFileSync(filePath, FILE_ENCODING);
    });

    fs.writeFileSync(dest, out.join(EOL), FILE_ENCODING);
    console.log(" - " + dest + " build." );
}

concat({"src": "src/class.js", "dest": "dist/class.js"});
