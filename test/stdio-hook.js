var exports;

exports = module.exports;

exports.setup = function (callback) {
    var write;
    write = process.stdout.write;
    process.stdout.write = (function (stub) {
        return function (string, encoding, fd) {
            stub.apply(process.stdout, arguments);
            return callback(string, encoding, fd);
        };
    })(process.stdout.write);
    return function () {
        return process.stdout.write = write;
    };
};