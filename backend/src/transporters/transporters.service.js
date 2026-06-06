"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.TransportersService = void 0;
var common_1 = require("@nestjs/common");
var enum_1 = require("../utils/enum");
var TransportersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TransportersService = _classThis = /** @class */ (function () {
        function TransportersService_1(prisma, userService) {
            this.prisma = prisma;
            this.userService = userService;
        }
        TransportersService_1.prototype.create = function (createTransporterDto) {
            var _a;
            return this.userService.create(__assign(__assign({}, createTransporterDto), { roleId: (_a = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _a === void 0 ? void 0 : _a.id }));
        };
        TransportersService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, verified, firstName, conditions, totalCount, transporters;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            page = query.page, limit = query.limit, verified = query.verified, firstName = query.firstName;
                            conditions = {
                                roleId: 2,
                            };
                            // Add verified condition
                            if (verified !== undefined) {
                                conditions.verified = verified === 'true';
                            }
                            // Add email condition
                            if (firstName) {
                                conditions.firstName = { contains: firstName };
                            }
                            return [4 /*yield*/, this.prisma.user.count({
                                    where: __assign({}, conditions),
                                })];
                        case 1:
                            totalCount = _a.sent();
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: conditions,
                                    skip: (page - 1) * parseInt(limit), // Calculate skip value
                                    take: parseInt(limit),
                                    include: {
                                        carType: true,
                                        disponibility: true,
                                    },
                                })];
                        case 2:
                            transporters = _a.sent();
                            // Return the result
                            return [4 /*yield*/, (transporters === null || transporters === void 0 ? void 0 : transporters.map(function (el) { return el === null || el === void 0 ? true : delete el.password; }))];
                        case 3:
                            // Return the result
                            _a.sent();
                            return [2 /*return*/, {
                                    totalCount: totalCount,
                                    transporters: transporters,
                                }];
                    }
                });
            });
        };
        TransportersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: {
                                    id: id,
                                    // roleId: USERROLES?.transporter?.id
                                },
                                include: {
                                    deliverOrders: true,
                                    carType: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        TransportersService_1.prototype.findTransporterOrders = function (id, page, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var skip, user, totalOrders;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: {
                                        id: id,
                                    },
                                    include: {
                                        deliverOrders: {
                                            where: {
                                                orderStatusId: 2,
                                            },
                                            include: {
                                                source: true,
                                                recipient: true,
                                                packages: {
                                                    include: {
                                                        references: true,
                                                    },
                                                },
                                                pods: true,
                                            },
                                            skip: skip, // Number of records to skip
                                            take: limit, // Number of records to fetch
                                        },
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.order.count({
                                    where: {
                                        deliveredByUserId: id,
                                        orderStatusId: 2,
                                    },
                                })];
                        case 2:
                            totalOrders = _a.sent();
                            // Remove password from the user object
                            user === null || user === void 0 ? true : delete user.password;
                            // Paginated response
                            return [2 /*return*/, {
                                    user: user,
                                    deliverOrders: (user === null || user === void 0 ? void 0 : user.deliverOrders) || [],
                                    pagination: {
                                        total: totalOrders,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(totalOrders / limit),
                                    },
                                }];
                    }
                });
            });
        };
        TransportersService_1.prototype.findTransporterAcceptedOrders = function (id, page, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var skip, user, totalDeliverOrders;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: {
                                        id: id,
                                    },
                                    include: {
                                        deliverOrders: {
                                            where: {
                                                orderStatusId: 3,
                                                startTransitAt: {
                                                    not: null,
                                                },
                                            },
                                            include: {
                                                source: true,
                                                recipient: true,
                                                packages: {
                                                    include: {
                                                        references: true,
                                                    },
                                                },
                                                pods: true,
                                            },
                                            skip: skip,
                                            take: limit,
                                        },
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.order.count({
                                    where: {
                                        deliveredByUserId: id,
                                        orderStatusId: 3,
                                        startTransitAt: {
                                            not: null,
                                        },
                                    },
                                })];
                        case 2:
                            totalDeliverOrders = _a.sent();
                            // Remove password from the user object
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, {
                                    user: user,
                                    deliverOrders: (user === null || user === void 0 ? void 0 : user.deliverOrders) || [],
                                    pagination: {
                                        totalItems: totalDeliverOrders,
                                        totalPages: Math.ceil(totalDeliverOrders / limit),
                                        currentPage: page,
                                        pageSize: limit,
                                    },
                                }];
                    }
                });
            });
        };
        TransportersService_1.prototype.findTransporterDeliveredOrders = function (id, page, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var skip, user, totalDeliverOrders, totalPages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: {
                                        id: id,
                                    },
                                    include: {
                                        deliverOrders: {
                                            where: {
                                                orderStatusId: 4,
                                                startTransitAt: {
                                                    not: null,
                                                },
                                                deliveredAt: {
                                                    not: null,
                                                },
                                            },
                                            skip: skip, // Skip the records for the current page
                                            take: limit, // Take the limit number of records
                                            include: {
                                                source: true,
                                                recipient: true,
                                                packages: {
                                                    include: {
                                                        references: true,
                                                    },
                                                },
                                                pods: true,
                                                order_invoice: true,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.order.count({
                                    where: {
                                        deliveredByUserId: id,
                                        orderStatusId: 4,
                                        startTransitAt: {
                                            not: null,
                                        },
                                        deliveredAt: {
                                            not: null,
                                        },
                                    },
                                })];
                        case 2:
                            totalDeliverOrders = _a.sent();
                            totalPages = Math.ceil(totalDeliverOrders / limit);
                            // Remove password from the user object
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, {
                                    user: user === null || user === void 0 ? void 0 : user.deliverOrders,
                                    pagination: {
                                        currentPage: page,
                                        totalPages: totalPages,
                                        totalItems: totalDeliverOrders,
                                        limit: limit,
                                    },
                                }];
                    }
                });
            });
        };
        TransportersService_1.prototype.update = function (id, updateTransporterDto) {
            var _a;
            return this.userService.updateUser(id, __assign(__assign({}, updateTransporterDto), { roleId: (_a = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _a === void 0 ? void 0 : _a.id }));
        };
        TransportersService_1.prototype.remove = function (id) {
            return this.userService.removeUser(id);
        };
        return TransportersService_1;
    }());
    __setFunctionName(_classThis, "TransportersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransportersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransportersService = _classThis;
}();
exports.TransportersService = TransportersService;
