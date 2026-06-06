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
exports.CreateRespDTO = exports.CreateClaimDto = exports.AddClaimMsgDto = exports.CreateClaimMsgDto = exports.CreateClaimMsgPhotosDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var CreateClaimMsgPhotosDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    return _a = /** @class */ (function () {
            function CreateClaimMsgPhotosDto() {
                this.url = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _url_initializers, void 0));
            }
            return CreateClaimMsgPhotosDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateClaimMsgPhotosDto = CreateClaimMsgPhotosDto;
var CreateClaimMsgDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _messageContent_decorators;
    var _messageContent_initializers = [];
    var _senderId_decorators;
    var _senderId_initializers = [];
    var _photos_decorators;
    var _photos_initializers = [];
    return _a = /** @class */ (function () {
            function CreateClaimMsgDto() {
                this.messageContent = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _messageContent_initializers, void 0));
                this.senderId = __runInitializers(this, _senderId_initializers, void 0);
                this.photos = __runInitializers(this, _photos_initializers, void 0);
            }
            return CreateClaimMsgDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messageContent_decorators = [(0, swagger_1.ApiProperty)()];
            _senderId_decorators = [(0, swagger_1.ApiProperty)()];
            _photos_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return CreateClaimMsgPhotosDto; }, isArray: true })];
            __esDecorate(null, null, _messageContent_decorators, { kind: "field", name: "messageContent", static: false, private: false, access: { has: function (obj) { return "messageContent" in obj; }, get: function (obj) { return obj.messageContent; }, set: function (obj, value) { obj.messageContent = value; } }, metadata: _metadata }, _messageContent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: function (obj) { return "senderId" in obj; }, get: function (obj) { return obj.senderId; }, set: function (obj, value) { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: function (obj) { return "photos" in obj; }, get: function (obj) { return obj.photos; }, set: function (obj, value) { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateClaimMsgDto = CreateClaimMsgDto;
var AddClaimMsgDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _messageContent_decorators;
    var _messageContent_initializers = [];
    var _claimId_decorators;
    var _claimId_initializers = [];
    var _senderId_decorators;
    var _senderId_initializers = [];
    var _photos_decorators;
    var _photos_initializers = [];
    return _a = /** @class */ (function () {
            function AddClaimMsgDto() {
                this.messageContent = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _messageContent_initializers, void 0));
                this.claimId = __runInitializers(this, _claimId_initializers, void 0);
                this.senderId = __runInitializers(this, _senderId_initializers, void 0);
                this.photos = __runInitializers(this, _photos_initializers, void 0);
            }
            return AddClaimMsgDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _messageContent_decorators = [(0, swagger_1.ApiProperty)()];
            _claimId_decorators = [(0, swagger_1.ApiProperty)()];
            _senderId_decorators = [(0, swagger_1.ApiProperty)()];
            _photos_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return CreateClaimMsgPhotosDto; }, isArray: true })];
            __esDecorate(null, null, _messageContent_decorators, { kind: "field", name: "messageContent", static: false, private: false, access: { has: function (obj) { return "messageContent" in obj; }, get: function (obj) { return obj.messageContent; }, set: function (obj, value) { obj.messageContent = value; } }, metadata: _metadata }, _messageContent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _claimId_decorators, { kind: "field", name: "claimId", static: false, private: false, access: { has: function (obj) { return "claimId" in obj; }, get: function (obj) { return obj.claimId; }, set: function (obj, value) { obj.claimId = value; } }, metadata: _metadata }, _claimId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: function (obj) { return "senderId" in obj; }, get: function (obj) { return obj.senderId; }, set: function (obj, value) { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: function (obj) { return "photos" in obj; }, get: function (obj) { return obj.photos; }, set: function (obj, value) { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AddClaimMsgDto = AddClaimMsgDto;
var CreateClaimDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _statusId_decorators;
    var _statusId_initializers = [];
    var _orderId_decorators;
    var _orderId_initializers = [];
    var _messages_decorators;
    var _messages_initializers = [];
    return _a = /** @class */ (function () {
            function CreateClaimDto() {
                this.subject = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.statusId = __runInitializers(this, _statusId_initializers, void 0);
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.messages = __runInitializers(this, _messages_initializers, void 0);
            }
            return CreateClaimDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subject_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _statusId_decorators = [(0, swagger_1.ApiProperty)()];
            _orderId_decorators = [(0, swagger_1.ApiProperty)()];
            _messages_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return CreateClaimMsgDto; }, isArray: true })];
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _statusId_decorators, { kind: "field", name: "statusId", static: false, private: false, access: { has: function (obj) { return "statusId" in obj; }, get: function (obj) { return obj.statusId; }, set: function (obj, value) { obj.statusId = value; } }, metadata: _metadata }, _statusId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: function (obj) { return "orderId" in obj; }, get: function (obj) { return obj.orderId; }, set: function (obj, value) { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _messages_decorators, { kind: "field", name: "messages", static: false, private: false, access: { has: function (obj) { return "messages" in obj; }, get: function (obj) { return obj.messages; }, set: function (obj, value) { obj.messages = value; } }, metadata: _metadata }, _messages_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateClaimDto = CreateClaimDto;
var CreateRespDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    return _a = /** @class */ (function () {
            function CreateRespDTO() {
                this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            }
            return CreateRespDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return CreateClaimDto; }, isArray: true })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRespDTO = CreateRespDTO;
