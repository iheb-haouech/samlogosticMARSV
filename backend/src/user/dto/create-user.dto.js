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
exports.UserDTO = exports.UserDispoDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var UserDispoDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _goingTo_decorators;
    var _goingTo_initializers = [];
    var _startDay_decorators;
    var _startDay_initializers = [];
    var _endDay_decorators;
    var _endDay_initializers = [];
    var _startAt_decorators;
    var _startAt_initializers = [];
    var _endAt_decorators;
    var _endAt_initializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    return _a = /** @class */ (function () {
            function UserDispoDTO() {
                this.goingTo = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _goingTo_initializers, void 0));
                this.startDay = __runInitializers(this, _startDay_initializers, void 0);
                this.endDay = __runInitializers(this, _endDay_initializers, void 0);
                this.startAt = __runInitializers(this, _startAt_initializers, void 0);
                this.endAt = __runInitializers(this, _endAt_initializers, void 0);
                this.comment = __runInitializers(this, _comment_initializers, void 0);
            }
            return UserDispoDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _goingTo_decorators = [(0, swagger_1.ApiProperty)()];
            _startDay_decorators = [(0, swagger_1.ApiProperty)()];
            _endDay_decorators = [(0, swagger_1.ApiProperty)()];
            _startAt_decorators = [(0, swagger_1.ApiProperty)()];
            _endAt_decorators = [(0, swagger_1.ApiProperty)()];
            _comment_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _goingTo_decorators, { kind: "field", name: "goingTo", static: false, private: false, access: { has: function (obj) { return "goingTo" in obj; }, get: function (obj) { return obj.goingTo; }, set: function (obj, value) { obj.goingTo = value; } }, metadata: _metadata }, _goingTo_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _startDay_decorators, { kind: "field", name: "startDay", static: false, private: false, access: { has: function (obj) { return "startDay" in obj; }, get: function (obj) { return obj.startDay; }, set: function (obj, value) { obj.startDay = value; } }, metadata: _metadata }, _startDay_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _endDay_decorators, { kind: "field", name: "endDay", static: false, private: false, access: { has: function (obj) { return "endDay" in obj; }, get: function (obj) { return obj.endDay; }, set: function (obj, value) { obj.endDay = value; } }, metadata: _metadata }, _endDay_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _startAt_decorators, { kind: "field", name: "startAt", static: false, private: false, access: { has: function (obj) { return "startAt" in obj; }, get: function (obj) { return obj.startAt; }, set: function (obj, value) { obj.startAt = value; } }, metadata: _metadata }, _startAt_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _endAt_decorators, { kind: "field", name: "endAt", static: false, private: false, access: { has: function (obj) { return "endAt" in obj; }, get: function (obj) { return obj.endAt; }, set: function (obj, value) { obj.endAt = value; } }, metadata: _metadata }, _endAt_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UserDispoDTO = UserDispoDTO;
var UserDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _roleId_decorators;
    var _roleId_initializers = [];
    var _companyName_decorators;
    var _companyName_initializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _zipCode_decorators;
    var _zipCode_initializers = [];
    var _websiteUrl_decorators;
    var _websiteUrl_initializers = [];
    var _commercialRegister_decorators;
    var _commercialRegister_initializers = [];
    var _patent_decorators;
    var _patent_initializers = [];
    var _companyTypeId_decorators;
    var _companyTypeId_initializers = [];
    var _userPackId_decorators;
    var _userPackId_initializers = [];
    var _carNumber_decorators;
    var _carNumber_initializers = [];
    var _carTypeId_decorators;
    var _carTypeId_initializers = [];
    var _carWidth_decorators;
    var _carWidth_initializers = [];
    var _carHeight_decorators;
    var _carHeight_initializers = [];
    var _carWeight_decorators;
    var _carWeight_initializers = [];
    var _disponibility_decorators;
    var _disponibility_initializers = [];
    var _verified_decorators;
    var _verified_initializers = [];
    return _a = /** @class */ (function () {
            function UserDTO() {
                this.firstName = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _firstName_initializers, void 0));
                this.lastName = __runInitializers(this, _lastName_initializers, void 0);
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.password = __runInitializers(this, _password_initializers, void 0);
                this.roleId = __runInitializers(this, _roleId_initializers, void 0); // Adjust according to Prisma schema
                this.companyName = __runInitializers(this, _companyName_initializers, void 0);
                this.city = __runInitializers(this, _city_initializers, void 0);
                this.country = __runInitializers(this, _country_initializers, void 0);
                this.address = __runInitializers(this, _address_initializers, void 0);
                this.zipCode = __runInitializers(this, _zipCode_initializers, void 0);
                this.websiteUrl = __runInitializers(this, _websiteUrl_initializers, void 0);
                this.commercialRegister = __runInitializers(this, _commercialRegister_initializers, void 0);
                this.patent = __runInitializers(this, _patent_initializers, void 0);
                this.companyTypeId = __runInitializers(this, _companyTypeId_initializers, void 0);
                this.userPackId = __runInitializers(this, _userPackId_initializers, void 0);
                this.carNumber = __runInitializers(this, _carNumber_initializers, void 0);
                this.carTypeId = __runInitializers(this, _carTypeId_initializers, void 0);
                this.carWidth = __runInitializers(this, _carWidth_initializers, void 0);
                this.carHeight = __runInitializers(this, _carHeight_initializers, void 0);
                this.carWeight = __runInitializers(this, _carWeight_initializers, void 0);
                this.disponibility = __runInitializers(this, _disponibility_initializers, void 0);
                this.verified = __runInitializers(this, _verified_initializers, void 0);
            }
            return UserDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, swagger_1.ApiProperty)()];
            _lastName_decorators = [(0, swagger_1.ApiProperty)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)()];
            _email_decorators = [(0, swagger_1.ApiProperty)()];
            _password_decorators = [(0, swagger_1.ApiProperty)()];
            _roleId_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return Number; }, required: false })];
            _companyName_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _city_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _country_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _address_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _zipCode_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _websiteUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _commercialRegister_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _patent_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _companyTypeId_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return Number; }, required: false })];
            _userPackId_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return Number; }, required: false })];
            _carNumber_decorators = [(0, swagger_1.ApiProperty)()];
            _carTypeId_decorators = [(0, swagger_1.ApiProperty)()];
            _carWidth_decorators = [(0, swagger_1.ApiProperty)()];
            _carHeight_decorators = [(0, swagger_1.ApiProperty)()];
            _carWeight_decorators = [(0, swagger_1.ApiProperty)()];
            _disponibility_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return UserDispoDTO; }, isArray: false })];
            _verified_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: function (obj) { return "roleId" in obj; }, get: function (obj) { return obj.roleId; }, set: function (obj, value) { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _companyName_decorators, { kind: "field", name: "companyName", static: false, private: false, access: { has: function (obj) { return "companyName" in obj; }, get: function (obj) { return obj.companyName; }, set: function (obj, value) { obj.companyName = value; } }, metadata: _metadata }, _companyName_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _zipCode_decorators, { kind: "field", name: "zipCode", static: false, private: false, access: { has: function (obj) { return "zipCode" in obj; }, get: function (obj) { return obj.zipCode; }, set: function (obj, value) { obj.zipCode = value; } }, metadata: _metadata }, _zipCode_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _websiteUrl_decorators, { kind: "field", name: "websiteUrl", static: false, private: false, access: { has: function (obj) { return "websiteUrl" in obj; }, get: function (obj) { return obj.websiteUrl; }, set: function (obj, value) { obj.websiteUrl = value; } }, metadata: _metadata }, _websiteUrl_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _commercialRegister_decorators, { kind: "field", name: "commercialRegister", static: false, private: false, access: { has: function (obj) { return "commercialRegister" in obj; }, get: function (obj) { return obj.commercialRegister; }, set: function (obj, value) { obj.commercialRegister = value; } }, metadata: _metadata }, _commercialRegister_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _patent_decorators, { kind: "field", name: "patent", static: false, private: false, access: { has: function (obj) { return "patent" in obj; }, get: function (obj) { return obj.patent; }, set: function (obj, value) { obj.patent = value; } }, metadata: _metadata }, _patent_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _companyTypeId_decorators, { kind: "field", name: "companyTypeId", static: false, private: false, access: { has: function (obj) { return "companyTypeId" in obj; }, get: function (obj) { return obj.companyTypeId; }, set: function (obj, value) { obj.companyTypeId = value; } }, metadata: _metadata }, _companyTypeId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _userPackId_decorators, { kind: "field", name: "userPackId", static: false, private: false, access: { has: function (obj) { return "userPackId" in obj; }, get: function (obj) { return obj.userPackId; }, set: function (obj, value) { obj.userPackId = value; } }, metadata: _metadata }, _userPackId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _carNumber_decorators, { kind: "field", name: "carNumber", static: false, private: false, access: { has: function (obj) { return "carNumber" in obj; }, get: function (obj) { return obj.carNumber; }, set: function (obj, value) { obj.carNumber = value; } }, metadata: _metadata }, _carNumber_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _carTypeId_decorators, { kind: "field", name: "carTypeId", static: false, private: false, access: { has: function (obj) { return "carTypeId" in obj; }, get: function (obj) { return obj.carTypeId; }, set: function (obj, value) { obj.carTypeId = value; } }, metadata: _metadata }, _carTypeId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _carWidth_decorators, { kind: "field", name: "carWidth", static: false, private: false, access: { has: function (obj) { return "carWidth" in obj; }, get: function (obj) { return obj.carWidth; }, set: function (obj, value) { obj.carWidth = value; } }, metadata: _metadata }, _carWidth_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _carHeight_decorators, { kind: "field", name: "carHeight", static: false, private: false, access: { has: function (obj) { return "carHeight" in obj; }, get: function (obj) { return obj.carHeight; }, set: function (obj, value) { obj.carHeight = value; } }, metadata: _metadata }, _carHeight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _carWeight_decorators, { kind: "field", name: "carWeight", static: false, private: false, access: { has: function (obj) { return "carWeight" in obj; }, get: function (obj) { return obj.carWeight; }, set: function (obj, value) { obj.carWeight = value; } }, metadata: _metadata }, _carWeight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _disponibility_decorators, { kind: "field", name: "disponibility", static: false, private: false, access: { has: function (obj) { return "disponibility" in obj; }, get: function (obj) { return obj.disponibility; }, set: function (obj, value) { obj.disponibility = value; } }, metadata: _metadata }, _disponibility_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _verified_decorators, { kind: "field", name: "verified", static: false, private: false, access: { has: function (obj) { return "verified" in obj; }, get: function (obj) { return obj.verified; }, set: function (obj, value) { obj.verified = value; } }, metadata: _metadata }, _verified_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UserDTO = UserDTO;
