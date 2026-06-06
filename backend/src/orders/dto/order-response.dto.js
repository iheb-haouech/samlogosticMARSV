"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AllOrderDtoResponse = exports.OrderDtoResponse = void 0;
var swagger_1 = require("@nestjs/swagger");
var update_order_dto_1 = require("./update-order.dto");
var OrderDtoResponse = /** @class */ (function (_super) {
    __extends(OrderDtoResponse, _super);
    function OrderDtoResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OrderDtoResponse;
}((0, swagger_1.PartialType)(update_order_dto_1.UpdateOrderDtoRes)));
exports.OrderDtoResponse = OrderDtoResponse;
var AllOrderDtoResponse = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _orders_decorators;
    var _orders_initializers = [];
    var _totalCount_decorators;
    var _totalCount_initializers = [];
    return _a = /** @class */ (function () {
            function AllOrderDtoResponse() {
                this.orders = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _orders_initializers, void 0));
                this.totalCount = __runInitializers(this, _totalCount_initializers, void 0);
            }
            return AllOrderDtoResponse;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orders_decorators = [(0, swagger_1.ApiProperty)({ type: function () { return [update_order_dto_1.UpdateOrderDtoRes]; }, isArray: true })];
            _totalCount_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _orders_decorators, { kind: "field", name: "orders", static: false, private: false, access: { has: function (obj) { return "orders" in obj; }, get: function (obj) { return obj.orders; }, set: function (obj, value) { obj.orders = value; } }, metadata: _metadata }, _orders_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _totalCount_decorators, { kind: "field", name: "totalCount", static: false, private: false, access: { has: function (obj) { return "totalCount" in obj; }, get: function (obj) { return obj.totalCount; }, set: function (obj, value) { obj.totalCount = value; } }, metadata: _metadata }, _totalCount_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AllOrderDtoResponse = AllOrderDtoResponse;
