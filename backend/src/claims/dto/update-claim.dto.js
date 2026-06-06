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
exports.UpdateRespDTO = exports.UpdateClaimDto = exports.UpdateClaimMsgDto = exports.UpdateClaimMsgPhotosDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var UpdateClaimMsgPhotosDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _url_decorators;
    var _url_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateClaimMsgPhotosDto() {
                this.id = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.url = __runInitializers(this, _url_initializers, void 0);
            }
            return UpdateClaimMsgPhotosDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _url_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateClaimMsgPhotosDto = UpdateClaimMsgPhotosDto;
var UpdateClaimMsgDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _messageContent_decorators;
    var _messageContent_initializers = [];
    var _senderId_decorators;
    var _senderId_initializers = [];
    var _photos_decorators;
    var _photos_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateClaimMsgDto() {
                this.id = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.messageContent = __runInitializers(this, _messageContent_initializers, void 0);
                this.senderId = __runInitializers(this, _senderId_initializers, void 0);
                this.photos = __runInitializers(this, _photos_initializers, void 0);
            }
            return UpdateClaimMsgDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _messageContent_decorators = [(0, swagger_1.ApiProperty)()];
            _senderId_decorators = [(0, swagger_1.ApiProperty)()];
            _photos_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return UpdateClaimMsgPhotosDto; }, isArray: true })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _messageContent_decorators, { kind: "field", name: "messageContent", static: false, private: false, access: { has: function (obj) { return "messageContent" in obj; }, get: function (obj) { return obj.messageContent; }, set: function (obj, value) { obj.messageContent = value; } }, metadata: _metadata }, _messageContent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: function (obj) { return "senderId" in obj; }, get: function (obj) { return obj.senderId; }, set: function (obj, value) { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: function (obj) { return "photos" in obj; }, get: function (obj) { return obj.photos; }, set: function (obj, value) { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateClaimMsgDto = UpdateClaimMsgDto;
var UpdateClaimDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _statusId_decorators;
    var _statusId_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateClaimDto() {
                this.statusId = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _statusId_initializers, void 0));
            }
            return UpdateClaimDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _statusId_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _statusId_decorators, { kind: "field", name: "statusId", static: false, private: false, access: { has: function (obj) { return "statusId" in obj; }, get: function (obj) { return obj.statusId; }, set: function (obj, value) { obj.statusId = value; } }, metadata: _metadata }, _statusId_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateClaimDto = UpdateClaimDto;
var UpdateRespDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateRespDTO() {
                this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            }
            return UpdateRespDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return UpdateClaimDto; }, isArray: true })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateRespDTO = UpdateRespDTO;
