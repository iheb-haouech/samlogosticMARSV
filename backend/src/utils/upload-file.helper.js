"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editFileName = exports.FileUploadTypeSchema = void 0;
var path_1 = require("path");
exports.FileUploadTypeSchema = {
    type: 'object',
    properties: {
        file: {
            type: 'string',
            format: 'binary',
        },
    },
};
var editFileName = function (req, file, callback) {
    var name = file.originalname.split('.')[0];
    var fileExtName = (0, path_1.extname)(file.originalname);
    var randomName = Array(4)
        .fill(null)
        .map(function () { return Math.round(Math.random() * 16).toString(16); })
        .join('');
    var timestamp = new Date().getTime();
    callback(null, "".concat(name, "-").concat(randomName, "-").concat(timestamp).concat(fileExtName));
};
exports.editFileName = editFileName;
