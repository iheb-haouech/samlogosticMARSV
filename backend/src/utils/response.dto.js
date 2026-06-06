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
exports.StatisticsDTO = exports.ResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var ResponseDto = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    return _a = /** @class */ (function () {
            function ResponseDto() {
                this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            }
            return ResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ResponseDto = ResponseDto;
var StatisticsDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _totalWaitingOrders_decorators;
    var _totalWaitingOrders_initializers = [];
    var _totalTransitOrders_decorators;
    var _totalTransitOrders_initializers = [];
    var _totalLivredOrders_decorators;
    var _totalLivredOrders_initializers = [];
    var _totalCanceledOrders_decorators;
    var _totalCanceledOrders_initializers = [];
    var _totalAcceptedProviders_decorators;
    var _totalAcceptedProviders_initializers = [];
    var _totalWaitingProviders_decorators;
    var _totalWaitingProviders_initializers = [];
    var _totalAcceptedTransporters_decorators;
    var _totalAcceptedTransporters_initializers = [];
    var _totalWaitingTransporters_decorators;
    var _totalWaitingTransporters_initializers = [];
    return _a = /** @class */ (function () {
            function StatisticsDTO() {
                this.totalWaitingOrders = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _totalWaitingOrders_initializers, void 0));
                this.totalTransitOrders = __runInitializers(this, _totalTransitOrders_initializers, void 0);
                this.totalLivredOrders = __runInitializers(this, _totalLivredOrders_initializers, void 0);
                this.totalCanceledOrders = __runInitializers(this, _totalCanceledOrders_initializers, void 0);
                this.totalAcceptedProviders = __runInitializers(this, _totalAcceptedProviders_initializers, void 0);
                this.totalWaitingProviders = __runInitializers(this, _totalWaitingProviders_initializers, void 0);
                this.totalAcceptedTransporters = __runInitializers(this, _totalAcceptedTransporters_initializers, void 0);
                this.totalWaitingTransporters = __runInitializers(this, _totalWaitingTransporters_initializers, void 0);
            }
            return StatisticsDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalWaitingOrders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalTransitOrders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalLivredOrders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalCanceledOrders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalAcceptedProviders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalWaitingProviders_decorators = [(0, swagger_1.ApiProperty)()];
            _totalAcceptedTransporters_decorators = [(0, swagger_1.ApiProperty)()];
            _totalWaitingTransporters_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _totalWaitingOrders_decorators, { kind: "field", name: "totalWaitingOrders", static: false, private: false, access: { has: function (obj) { return "totalWaitingOrders" in obj; }, get: function (obj) { return obj.totalWaitingOrders; }, set: function (obj, value) { obj.totalWaitingOrders = value; } }, metadata: _metadata }, _totalWaitingOrders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalTransitOrders_decorators, { kind: "field", name: "totalTransitOrders", static: false, private: false, access: { has: function (obj) { return "totalTransitOrders" in obj; }, get: function (obj) { return obj.totalTransitOrders; }, set: function (obj, value) { obj.totalTransitOrders = value; } }, metadata: _metadata }, _totalTransitOrders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalLivredOrders_decorators, { kind: "field", name: "totalLivredOrders", static: false, private: false, access: { has: function (obj) { return "totalLivredOrders" in obj; }, get: function (obj) { return obj.totalLivredOrders; }, set: function (obj, value) { obj.totalLivredOrders = value; } }, metadata: _metadata }, _totalLivredOrders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalCanceledOrders_decorators, { kind: "field", name: "totalCanceledOrders", static: false, private: false, access: { has: function (obj) { return "totalCanceledOrders" in obj; }, get: function (obj) { return obj.totalCanceledOrders; }, set: function (obj, value) { obj.totalCanceledOrders = value; } }, metadata: _metadata }, _totalCanceledOrders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalAcceptedProviders_decorators, { kind: "field", name: "totalAcceptedProviders", static: false, private: false, access: { has: function (obj) { return "totalAcceptedProviders" in obj; }, get: function (obj) { return obj.totalAcceptedProviders; }, set: function (obj, value) { obj.totalAcceptedProviders = value; } }, metadata: _metadata }, _totalAcceptedProviders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalWaitingProviders_decorators, { kind: "field", name: "totalWaitingProviders", static: false, private: false, access: { has: function (obj) { return "totalWaitingProviders" in obj; }, get: function (obj) { return obj.totalWaitingProviders; }, set: function (obj, value) { obj.totalWaitingProviders = value; } }, metadata: _metadata }, _totalWaitingProviders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalAcceptedTransporters_decorators, { kind: "field", name: "totalAcceptedTransporters", static: false, private: false, access: { has: function (obj) { return "totalAcceptedTransporters" in obj; }, get: function (obj) { return obj.totalAcceptedTransporters; }, set: function (obj, value) { obj.totalAcceptedTransporters = value; } }, metadata: _metadata }, _totalAcceptedTransporters_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalWaitingTransporters_decorators, { kind: "field", name: "totalWaitingTransporters", static: false, private: false, access: { has: function (obj) { return "totalWaitingTransporters" in obj; }, get: function (obj) { return obj.totalWaitingTransporters; }, set: function (obj, value) { obj.totalWaitingTransporters = value; } }, metadata: _metadata }, _totalWaitingTransporters_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StatisticsDTO = StatisticsDTO;
