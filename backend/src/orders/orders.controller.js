"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
var rxjs_1 = require("rxjs"); // idem
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var role_guard_1 = require("../auth/role.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var response_dto_1 = require("../utils/response.dto");
var enum_1 = require("../utils/enum");
var order_response_dto_1 = require("./dto/order-response.dto");
var OrdersController = function () {
    var _classDecorators = [(0, common_1.Controller)('orders'), (0, swagger_1.ApiTags)('orders')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _triggerInvoice_decorators;
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _findOrderStatus_decorators;
    var _update_decorators;
    var _updateOrderTransporter_decorators;
    var _togglePayment_decorators;
    var _markPaid_decorators;
    var _updateStatus_decorators;
    var _remove_decorators;
    var OrdersController = _classThis = /** @class */ (function () {
        function OrdersController_1(ordersService, httpService, // 👈 ajoute ça
        pdfGeneratorService) {
            this.ordersService = (__runInitializers(this, _instanceExtraInitializers), ordersService);
            this.httpService = httpService;
            this.pdfGeneratorService = pdfGeneratorService;
        }
        OrdersController_1.prototype.triggerInvoice = function (id) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var order, payload, n8nUrl;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.ordersService.findOne(id)];
                        case 1:
                            order = _c.sent();
                            payload = {
                                orderId: order.id,
                                trackingId: order.trackingId,
                                customerEmail: (_a = order.recipient) === null || _a === void 0 ? void 0 : _a.email,
                                customerName: (_b = order.recipient) === null || _b === void 0 ? void 0 : _b.companyName,
                            };
                            n8nUrl = "https://TON_N8N_URL/webhook/invoice-trigger";
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.post(n8nUrl, payload))];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        OrdersController_1.prototype.create = function (userToken, createOrderDto) {
            return this.ordersService.create(userToken, createOrderDto);
        };
        OrdersController_1.prototype.findAll = function (userToken, page, limit, trackingId, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.ordersService.findAll(userToken, +page, +limit, trackingId, status)];
                });
            });
        };
        OrdersController_1.prototype.findOne = function (id) {
            return this.ordersService.findOne(id);
        };
        OrdersController_1.prototype.findOrderStatus = function (id) {
            return this.ordersService.findOrder(id);
        };
        OrdersController_1.prototype.update = function (id, updateOrderDto) {
            return this.ordersService.update(id, updateOrderDto);
        };
        OrdersController_1.prototype.updateOrderTransporter = function (id, updateOrderDto) {
            return this.ordersService.updateOrderTransporter(id, updateOrderDto);
        };
        OrdersController_1.prototype.togglePayment = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.ordersService.togglePaymentRequired(id, dto)];
                });
            });
        };
        OrdersController_1.prototype.markPaid = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.ordersService.markPaid(id)];
                });
            });
        };
        OrdersController_1.prototype.updateStatus = function (id, updateOrderDto) {
            return this.ordersService.updateOrderStatus(id, updateOrderDto);
        };
        OrdersController_1.prototype.remove = function (id) {
            return this.ordersService.remove(id);
        };
        return OrdersController_1;
    }());
    __setFunctionName(_classThis, "OrdersController");
    (function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _triggerInvoice_decorators = [(0, common_1.Post)(":id/invoice-trigger")];
        _create_decorators = [(0, common_1.Post)('/create-order'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_a = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _a === void 0 ? void 0 : _a.id, (_b = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _b === void 0 ? void 0 : _b.id), (0, swagger_1.ApiOkResponse)({
                description: 'Update order response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _findAll_decorators = [(0, common_1.Get)('/all-orders'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_c = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _c === void 0 ? void 0 : _c.id, (_d = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _d === void 0 ? void 0 : _d.id, (_e = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _e === void 0 ? void 0 : _e.id), (0, swagger_1.ApiOkResponse)({
                description: 'Get all orders response',
                type: order_response_dto_1.AllOrderDtoResponse,
            })];
        _findOne_decorators = [(0, common_1.Get)('/order-details/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_f = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _f === void 0 ? void 0 : _f.id, (_g = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _g === void 0 ? void 0 : _g.id, (_h = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _h === void 0 ? void 0 : _h.id), (0, swagger_1.ApiOkResponse)({
                description: 'Get order details response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _findOrderStatus_decorators = [(0, common_1.Get)('/order-status-details/:id'), (0, swagger_1.ApiOkResponse)({
                description: 'Get order details response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _update_decorators = [(0, common_1.Patch)('/update-order/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_j = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _j === void 0 ? void 0 : _j.id, (_k = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _k === void 0 ? void 0 : _k.id), (0, swagger_1.ApiOkResponse)({
                description: 'Update order response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _updateOrderTransporter_decorators = [(0, common_1.Patch)('/update-order-transporter/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_l = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _l === void 0 ? void 0 : _l.id, (_m = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _m === void 0 ? void 0 : _m.id), (0, swagger_1.ApiOkResponse)({
                description: 'Update order response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _togglePayment_decorators = [(0, common_1.Patch)(':id/payment'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_o = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _o === void 0 ? void 0 : _o.id)];
        _markPaid_decorators = [(0, common_1.Patch)(':id/paid'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_p = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _p === void 0 ? void 0 : _p.id)];
        _updateStatus_decorators = [(0, common_1.Patch)('/update-order-status/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_q = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _q === void 0 ? void 0 : _q.id, (_r = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _r === void 0 ? void 0 : _r.id, (_s = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _s === void 0 ? void 0 : _s.id), (0, swagger_1.ApiOkResponse)({
                description: 'Update order response',
                type: order_response_dto_1.OrderDtoResponse,
            })];
        _remove_decorators = [(0, common_1.Delete)('/delete-order/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_t = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _t === void 0 ? void 0 : _t.id, (_u = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _u === void 0 ? void 0 : _u.id), (0, swagger_1.ApiOkResponse)({
                description: 'Update order response',
                type: response_dto_1.ResponseDto,
            })];
        __esDecorate(_classThis, null, _triggerInvoice_decorators, { kind: "method", name: "triggerInvoice", static: false, private: false, access: { has: function (obj) { return "triggerInvoice" in obj; }, get: function (obj) { return obj.triggerInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOrderStatus_decorators, { kind: "method", name: "findOrderStatus", static: false, private: false, access: { has: function (obj) { return "findOrderStatus" in obj; }, get: function (obj) { return obj.findOrderStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateOrderTransporter_decorators, { kind: "method", name: "updateOrderTransporter", static: false, private: false, access: { has: function (obj) { return "updateOrderTransporter" in obj; }, get: function (obj) { return obj.updateOrderTransporter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _togglePayment_decorators, { kind: "method", name: "togglePayment", static: false, private: false, access: { has: function (obj) { return "togglePayment" in obj; }, get: function (obj) { return obj.togglePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markPaid_decorators, { kind: "method", name: "markPaid", static: false, private: false, access: { has: function (obj) { return "markPaid" in obj; }, get: function (obj) { return obj.markPaid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersController = _classThis;
}();
exports.OrdersController = OrdersController;
