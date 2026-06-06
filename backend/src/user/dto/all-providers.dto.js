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
exports.GetProviderInvoiceDto = exports.FindManyProvidersDto = exports.AllProvidersDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var AllProvidersDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    return _a = /** @class */ (function () {
            function AllProvidersDTO() {
                this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            }
            return AllProvidersDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AllProvidersDTO = AllProvidersDTO;
var FindManyProvidersDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _verified_decorators;
    var _verified_initializers = [];
    return _a = /** @class */ (function () {
            function FindManyProvidersDto() {
                this.page = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = __runInitializers(this, _limit_initializers, void 0);
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.verified = __runInitializers(this, _verified_initializers, void 0);
            }
            return FindManyProvidersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number for pagination' })];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Limit of items per page' })];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email filter' })];
            _verified_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Verification status filter' })];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _verified_decorators, { kind: "field", name: "verified", static: false, private: false, access: { has: function (obj) { return "verified" in obj; }, get: function (obj) { return obj.verified; }, set: function (obj, value) { obj.verified = value; } }, metadata: _metadata }, _verified_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FindManyProvidersDto = FindManyProvidersDto;
var GetProviderInvoiceDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _from_decorators;
    var _from_initializers = [];
    var _to_decorators;
    var _to_initializers = [];
    var _invoiceType_decorators;
    var _invoiceType_initializers = [];
    return _a = /** @class */ (function () {
            function GetProviderInvoiceDto() {
                this.id = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.from = __runInitializers(this, _from_initializers, void 0);
                this.to = __runInitializers(this, _to_initializers, void 0);
                this.invoiceType = __runInitializers(this, _invoiceType_initializers, void 0);
            }
            return GetProviderInvoiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _from_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: new Date() })];
            _to_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: new Date() })];
            _invoiceType_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _invoiceType_decorators, { kind: "field", name: "invoiceType", static: false, private: false, access: { has: function (obj) { return "invoiceType" in obj; }, get: function (obj) { return obj.invoiceType; }, set: function (obj, value) { obj.invoiceType = value; } }, metadata: _metadata }, _invoiceType_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetProviderInvoiceDto = GetProviderInvoiceDto;
