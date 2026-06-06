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
exports.ClaimRespDTO = exports.AllCLaimsRespDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var update_claim_dto_1 = require("./update-claim.dto");
var AllCLaimsRespDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _totalCount_decorators;
    var _totalCount_initializers = [];
    var _claims_decorators;
    var _claims_initializers = [];
    return _a = /** @class */ (function () {
            function AllCLaimsRespDTO() {
                this.totalCount = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _totalCount_initializers, void 0));
                this.claims = __runInitializers(this, _claims_initializers, void 0);
            }
            return AllCLaimsRespDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalCount_decorators = [(0, swagger_1.ApiProperty)()];
            _claims_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return update_claim_dto_1.UpdateClaimDto; }, isArray: true })];
            __esDecorate(null, null, _totalCount_decorators, { kind: "field", name: "totalCount", static: false, private: false, access: { has: function (obj) { return "totalCount" in obj; }, get: function (obj) { return obj.totalCount; }, set: function (obj, value) { obj.totalCount = value; } }, metadata: _metadata }, _totalCount_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _claims_decorators, { kind: "field", name: "claims", static: false, private: false, access: { has: function (obj) { return "claims" in obj; }, get: function (obj) { return obj.claims; }, set: function (obj, value) { obj.claims = value; } }, metadata: _metadata }, _claims_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AllCLaimsRespDTO = AllCLaimsRespDTO;
var ClaimRespDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    return _a = /** @class */ (function () {
            function ClaimRespDTO() {
                this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            }
            return ClaimRespDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClaimRespDTO = ClaimRespDTO;
