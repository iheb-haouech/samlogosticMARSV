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
exports.UpdateOrderRecipientDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var UpdateOrderRecipientDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _companyName_decorators;
    var _companyName_initializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _streetAddress_decorators;
    var _streetAddress_initializers = [];
    var _secondAddress_decorators;
    var _secondAddress_initializers = [];
    var _zipCode_decorators;
    var _zipCode_initializers = [];
    var _email_decorators;
    var _email_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateOrderRecipientDTO() {
                this.id = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.companyName = __runInitializers(this, _companyName_initializers, void 0);
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.city = __runInitializers(this, _city_initializers, void 0);
                this.country = __runInitializers(this, _country_initializers, void 0);
                this.streetAddress = __runInitializers(this, _streetAddress_initializers, void 0);
                this.secondAddress = __runInitializers(this, _secondAddress_initializers, void 0);
                this.zipCode = __runInitializers(this, _zipCode_initializers, void 0);
                this.email = __runInitializers(this, _email_initializers, void 0);
            }
            return UpdateOrderRecipientDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _companyName_decorators = [(0, swagger_1.ApiProperty)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)()];
            _city_decorators = [(0, swagger_1.ApiProperty)()];
            _country_decorators = [(0, swagger_1.ApiProperty)()];
            _streetAddress_decorators = [(0, swagger_1.ApiProperty)()];
            _secondAddress_decorators = [(0, swagger_1.ApiProperty)()];
            _zipCode_decorators = [(0, swagger_1.ApiProperty)()];
            _email_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: function (obj) { return "companyName" in obj; }, get: function (obj) { return obj.companyName; }, set: function (obj, value) { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _streetAddress_decorators, { kind: "field", name: "streetAddress", static: false, private: false, access: { has: function (obj) { return "streetAddress" in obj; }, get: function (obj) { return obj.streetAddress; }, set: function (obj, value) { obj.streetAddress = value; } }, metadata: _metadata }, _streetAddress_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _secondAddress_decorators, { kind: "field", name: "secondAddress", static: false, private: false, access: { has: function (obj) { return "secondAddress" in obj; }, get: function (obj) { return obj.secondAddress; }, set: function (obj, value) { obj.secondAddress = value; } }, metadata: _metadata }, _secondAddress_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _zipCode_decorators, { kind: "field", name: "zipCode", static: false, private: false, access: { has: function (obj) { return "zipCode" in obj; }, get: function (obj) { return obj.zipCode; }, set: function (obj, value) { obj.zipCode = value; } }, metadata: _metadata }, _zipCode_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateOrderRecipientDTO = UpdateOrderRecipientDTO;
