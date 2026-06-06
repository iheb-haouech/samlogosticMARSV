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
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var response_dto_1 = require("../utils/response.dto");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var all_providers_dto_1 = require("./dto/all-providers.dto");
var role_guard_1 = require("../auth/role.guard");
var enum_1 = require("../utils/enum");
var roles_decorator_1 = require("../auth/roles.decorator");
var UserController = function () {
    var _classDecorators = [(0, common_1.Controller)('user'), (0, swagger_1.ApiTags)('user')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _getAllInvoices_decorators;
    var _findAll_decorators;
    var _findAllProviders_decorators;
    var _downloadInvoice_decorators;
    var _findOne_decorators;
    var _findProviderOrders_decorators;
    var _findUserOrdersInvoices_decorators;
    var _update_decorators;
    var _verifieUser_decorators;
    var _updateUserDisponibility_decorators;
    var _remove_decorators;
    var _getProvidersInvoice_decorators;
    var UserController = _classThis = /** @class */ (function () {
        function UserController_1(userService) {
            this.userService = (__runInitializers(this, _instanceExtraInitializers), userService);
        }
        UserController_1.prototype.create = function (createUserDto) {
            return this.userService.create(createUserDto);
        };
        UserController_1.prototype.getAllInvoices = function (query) {
            return this.userService.getAllInvoices(query);
        };
        UserController_1.prototype.findAll = function () {
            return this.userService.findAll();
        };
        UserController_1.prototype.findAllProviders = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userService.findAllProviders(query)];
                });
            });
        };
        UserController_1.prototype.downloadInvoice = function (userId, from, to, type, res) {
            return __awaiter(this, void 0, void 0, function () {
                var pdf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userService.generateInvoicePdf(Number(userId), from, to, type)];
                        case 1:
                            pdf = _a.sent();
                            res.setHeader('Content-Type', 'application/pdf');
                            return [2 /*return*/, res.send(pdf)];
                    }
                });
            });
        };
        UserController_1.prototype.findOne = function (id) {
            return this.userService.findOne(+id);
        };
        UserController_1.prototype.findProviderOrders = function (id) {
            return this.userService.findProviderOrders(+id);
        };
        UserController_1.prototype.findUserOrdersInvoices = function (id, query) {
            return this.userService.findUserOrdersInvoices(+id, query === null || query === void 0 ? void 0 : query.page, query === null || query === void 0 ? void 0 : query.limit);
        };
        UserController_1.prototype.update = function (id, userDto) {
            return this.userService.updateUser(+id, userDto);
        };
        UserController_1.prototype.verifieUser = function (id) {
            return this.userService.verifie(+id);
        };
        UserController_1.prototype.updateUserDisponibility = function (id, userDto) {
            return this.userService.updateUserDisponibility(+id, userDto);
        };
        UserController_1.prototype.remove = function (id) {
            return this.userService.removeUser(+id);
        };
        UserController_1.prototype.getProvidersInvoice = function (query, res) {
            console.log('ccccccccccccc', query);
            return this.userService.getProvidersInvoice(+(query === null || query === void 0 ? void 0 : query.id), query === null || query === void 0 ? void 0 : query.from, query === null || query === void 0 ? void 0 : query.to, +(query === null || query === void 0 ? void 0 : query.invoiceType), res);
        };
        return UserController_1;
    }());
    __setFunctionName(_classThis, "UserController");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _getAllInvoices_decorators = [(0, common_1.Get)('/invoices')];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _findAllProviders_decorators = [(0, common_1.Get)('all-providers'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiQuery)({ name: 'page', required: false }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false }), (0, swagger_1.ApiQuery)({ name: 'verified', required: false }), (0, swagger_1.ApiQuery)({ name: 'email', required: false }), (0, swagger_1.ApiOkResponse)({
                description: 'Get all providers response',
                type: all_providers_dto_1.AllProvidersDTO,
            }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard), (0, roles_decorator_1.Roles)((_a = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.admin) === null || _a === void 0 ? void 0 : _a.id)];
        _downloadInvoice_decorators = [(0, common_1.Get)('/invoice-pdf')];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _findProviderOrders_decorators = [(0, common_1.Get)('provider-orders/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _findUserOrdersInvoices_decorators = [(0, common_1.Post)('user-orders-invoices/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _verifieUser_decorators = [(0, common_1.Patch)('verfieUser/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _updateUserDisponibility_decorators = [(0, common_1.Patch)('/user-disponibility/:id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'users response',
                type: response_dto_1.ResponseDto,
            })];
        _getProvidersInvoice_decorators = [(0, common_1.Post)('/generate-provider-invoice'), (0, swagger_1.ApiOkResponse)({
                description: 'generate provider invoice in specific period',
                type: response_dto_1.ResponseDto,
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllInvoices_decorators, { kind: "method", name: "getAllInvoices", static: false, private: false, access: { has: function (obj) { return "getAllInvoices" in obj; }, get: function (obj) { return obj.getAllInvoices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllProviders_decorators, { kind: "method", name: "findAllProviders", static: false, private: false, access: { has: function (obj) { return "findAllProviders" in obj; }, get: function (obj) { return obj.findAllProviders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadInvoice_decorators, { kind: "method", name: "downloadInvoice", static: false, private: false, access: { has: function (obj) { return "downloadInvoice" in obj; }, get: function (obj) { return obj.downloadInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findProviderOrders_decorators, { kind: "method", name: "findProviderOrders", static: false, private: false, access: { has: function (obj) { return "findProviderOrders" in obj; }, get: function (obj) { return obj.findProviderOrders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findUserOrdersInvoices_decorators, { kind: "method", name: "findUserOrdersInvoices", static: false, private: false, access: { has: function (obj) { return "findUserOrdersInvoices" in obj; }, get: function (obj) { return obj.findUserOrdersInvoices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifieUser_decorators, { kind: "method", name: "verifieUser", static: false, private: false, access: { has: function (obj) { return "verifieUser" in obj; }, get: function (obj) { return obj.verifieUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUserDisponibility_decorators, { kind: "method", name: "updateUserDisponibility", static: false, private: false, access: { has: function (obj) { return "updateUserDisponibility" in obj; }, get: function (obj) { return obj.updateUserDisponibility; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProvidersInvoice_decorators, { kind: "method", name: "getProvidersInvoice", static: false, private: false, access: { has: function (obj) { return "getProvidersInvoice" in obj; }, get: function (obj) { return obj.getProvidersInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserController = _classThis;
}();
exports.UserController = UserController;
