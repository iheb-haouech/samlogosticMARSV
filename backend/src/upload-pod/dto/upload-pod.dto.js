"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadPodResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var UploadPodResponseDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _filename_decorators;
    var _filename_initializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _podUrl_decorators;
    var _podUrl_initializers = [];
    return _a = /** @class */ (function () {
            function UploadPodResponseDto() {
                this.filename = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _filename_initializers, void 0));
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.podUrl = __runInitializers(this, _podUrl_initializers, void 0);
            }
            return UploadPodResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _filename_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'The filename of the uploaded POD',
                    example: 'POD-order-id-12345.jpg',
                })];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'The MIME type of the uploaded file',
                    example: 'image/jpeg',
                })];
            _podUrl_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'The URL to access the uploaded POD file',
                    example: 'https://api.samlogistic.tn/uploadedFiles/POD-order-id-12345.jpg',
                })];
            __esDecorate(null, null, _filename_decorators, { kind: "field", name: "filename", static: false, private: false, access: { has: function (obj) { return "filename" in obj; }, get: function (obj) { return obj.filename; }, set: function (obj, value) { obj.filename = value; } }, metadata: _metadata }, _filename_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _podUrl_decorators, { kind: "field", name: "podUrl", static: false, private: false, access: { has: function (obj) { return "podUrl" in obj; }, get: function (obj) { return obj.podUrl; }, set: function (obj, value) { obj.podUrl = value; } }, metadata: _metadata }, _podUrl_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UploadPodResponseDto = UploadPodResponseDto;
