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
exports.CreateOrderDto = void 0;
// backend/src/orders/dto/create-order.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator"); // ✅ CORRECT
var class_transformer_1 = require("class-transformer");
var create_package_dto_1 = require("../../packages/dto/create-package.dto");
var create_recipient_dto_1 = require("./create-recipient.dto");
var create_source_dto_1 = require("./create-source.dto");
var CreateOrderDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _totalWeight_decorators;
    var _totalWeight_initializers = [];
    var _totalLength_decorators;
    var _totalLength_initializers = [];
    var _totalWidth_decorators;
    var _totalWidth_initializers = [];
    var _totalHeight_decorators;
    var _totalHeight_initializers = [];
    var _totalPrice_decorators;
    var _totalPrice_initializers = [];
    var _clientPrice_decorators;
    var _clientPrice_initializers = [];
    var _transporterPrice_decorators;
    var _transporterPrice_initializers = [];
    var _totalQuantity_decorators;
    var _totalQuantity_initializers = [];
    var _shipmentPrice_decorators;
    var _shipmentPrice_initializers = [];
    var _refrences_decorators;
    var _refrences_initializers = [];
    var _createdByUserId_decorators;
    var _createdByUserId_initializers = [];
    var _deliveredByUserId_decorators;
    var _deliveredByUserId_initializers = [];
    var _source_decorators;
    var _source_initializers = [];
    var _recipient_decorators;
    var _recipient_initializers = [];
    var _packages_decorators;
    var _packages_initializers = [];
    var _pods_decorators;
    var _pods_initializers = [];
    return _a = /** @class */ (function () {
            function CreateOrderDto() {
                this.description = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.totalWeight = __runInitializers(this, _totalWeight_initializers, void 0);
                this.totalLength = __runInitializers(this, _totalLength_initializers, void 0);
                this.totalWidth = __runInitializers(this, _totalWidth_initializers, void 0);
                this.totalHeight = __runInitializers(this, _totalHeight_initializers, void 0);
                this.totalPrice = __runInitializers(this, _totalPrice_initializers, void 0);
                this.clientPrice = __runInitializers(this, _clientPrice_initializers, void 0);
                this.transporterPrice = __runInitializers(this, _transporterPrice_initializers, void 0);
                this.totalQuantity = __runInitializers(this, _totalQuantity_initializers, void 0);
                this.shipmentPrice = __runInitializers(this, _shipmentPrice_initializers, void 0);
                this.refrences = __runInitializers(this, _refrences_initializers, void 0);
                this.createdByUserId = __runInitializers(this, _createdByUserId_initializers, void 0);
                this.deliveredByUserId = __runInitializers(this, _deliveredByUserId_initializers, void 0);
                this.source = __runInitializers(this, _source_initializers, void 0);
                this.recipient = __runInitializers(this, _recipient_initializers, void 0);
                this.packages = __runInitializers(this, _packages_initializers, void 0);
                this.pods = __runInitializers(this, _pods_initializers, void 0);
            }
            return CreateOrderDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _totalWeight_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _totalLength_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _totalWidth_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _totalHeight_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _totalPrice_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _clientPrice_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _transporterPrice_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _totalQuantity_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _shipmentPrice_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _refrences_decorators = [(0, swagger_1.ApiProperty)({ isArray: true, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _createdByUserId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _deliveredByUserId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _source_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return create_source_dto_1.OrderSourceDTO; }, required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return create_source_dto_1.OrderSourceDTO; })];
            _recipient_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return create_recipient_dto_1.OrderRecipientDTO; }, required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return create_recipient_dto_1.OrderRecipientDTO; })];
            _packages_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return [create_package_dto_1.CreateOrderPackagesDTO]; }, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_transformer_1.Type)(function () { return create_package_dto_1.CreateOrderPackagesDTO; })];
            _pods_decorators = [(0, swagger_1.ApiProperty)({ nullable: true, required: false }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalWeight_decorators, { kind: "field", name: "totalWeight", static: false, private: false, access: { has: function (obj) { return "totalWeight" in obj; }, get: function (obj) { return obj.totalWeight; }, set: function (obj, value) { obj.totalWeight = value; } }, metadata: _metadata }, _totalWeight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalLength_decorators, { kind: "field", name: "totalLength", static: false, private: false, access: { has: function (obj) { return "totalLength" in obj; }, get: function (obj) { return obj.totalLength; }, set: function (obj, value) { obj.totalLength = value; } }, metadata: _metadata }, _totalLength_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalWidth_decorators, { kind: "field", name: "totalWidth", static: false, private: false, access: { has: function (obj) { return "totalWidth" in obj; }, get: function (obj) { return obj.totalWidth; }, set: function (obj, value) { obj.totalWidth = value; } }, metadata: _metadata }, _totalWidth_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalHeight_decorators, { kind: "field", name: "totalHeight", static: false, private: false, access: { has: function (obj) { return "totalHeight" in obj; }, get: function (obj) { return obj.totalHeight; }, set: function (obj, value) { obj.totalHeight = value; } }, metadata: _metadata }, _totalHeight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalPrice_decorators, { kind: "field", name: "totalPrice", static: false, private: false, access: { has: function (obj) { return "totalPrice" in obj; }, get: function (obj) { return obj.totalPrice; }, set: function (obj, value) { obj.totalPrice = value; } }, metadata: _metadata }, _totalPrice_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _clientPrice_decorators, { kind: "field", name: "clientPrice", static: false, private: false, access: { has: function (obj) { return "clientPrice" in obj; }, get: function (obj) { return obj.clientPrice; }, set: function (obj, value) { obj.clientPrice = value; } }, metadata: _metadata }, _clientPrice_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _transporterPrice_decorators, { kind: "field", name: "transporterPrice", static: false, private: false, access: { has: function (obj) { return "transporterPrice" in obj; }, get: function (obj) { return obj.transporterPrice; }, set: function (obj, value) { obj.transporterPrice = value; } }, metadata: _metadata }, _transporterPrice_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalQuantity_decorators, { kind: "field", name: "totalQuantity", static: false, private: false, access: { has: function (obj) { return "totalQuantity" in obj; }, get: function (obj) { return obj.totalQuantity; }, set: function (obj, value) { obj.totalQuantity = value; } }, metadata: _metadata }, _totalQuantity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shipmentPrice_decorators, { kind: "field", name: "shipmentPrice", static: false, private: false, access: { has: function (obj) { return "shipmentPrice" in obj; }, get: function (obj) { return obj.shipmentPrice; }, set: function (obj, value) { obj.shipmentPrice = value; } }, metadata: _metadata }, _shipmentPrice_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _refrences_decorators, { kind: "field", name: "refrences", static: false, private: false, access: { has: function (obj) { return "refrences" in obj; }, get: function (obj) { return obj.refrences; }, set: function (obj, value) { obj.refrences = value; } }, metadata: _metadata }, _refrences_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _createdByUserId_decorators, { kind: "field", name: "createdByUserId", static: false, private: false, access: { has: function (obj) { return "createdByUserId" in obj; }, get: function (obj) { return obj.createdByUserId; }, set: function (obj, value) { obj.createdByUserId = value; } }, metadata: _metadata }, _createdByUserId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _deliveredByUserId_decorators, { kind: "field", name: "deliveredByUserId", static: false, private: false, access: { has: function (obj) { return "deliveredByUserId" in obj; }, get: function (obj) { return obj.deliveredByUserId; }, set: function (obj, value) { obj.deliveredByUserId = value; } }, metadata: _metadata }, _deliveredByUserId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: function (obj) { return "source" in obj; }, get: function (obj) { return obj.source; }, set: function (obj, value) { obj.source = value; } }, metadata: _metadata }, _source_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _recipient_decorators, { kind: "field", name: "recipient", static: false, private: false, access: { has: function (obj) { return "recipient" in obj; }, get: function (obj) { return obj.recipient; }, set: function (obj, value) { obj.recipient = value; } }, metadata: _metadata }, _recipient_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _packages_decorators, { kind: "field", name: "packages", static: false, private: false, access: { has: function (obj) { return "packages" in obj; }, get: function (obj) { return obj.packages; }, set: function (obj, value) { obj.packages = value; } }, metadata: _metadata }, _packages_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _pods_decorators, { kind: "field", name: "pods", static: false, private: false, access: { has: function (obj) { return "pods" in obj; }, get: function (obj) { return obj.pods; }, set: function (obj, value) { obj.pods = value; } }, metadata: _metadata }, _pods_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateOrderDto = CreateOrderDto;
