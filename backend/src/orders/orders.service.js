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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
var common_1 = require("@nestjs/common");
var create_order_dto_1 = require("./dto/create-order.dto");
var class_transformer_1 = require("class-transformer");
var generate_id_1 = require("../utils/generate-id");
var OrdersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OrdersService = _classThis = /** @class */ (function () {
        function OrdersService_1(prisma, authService, packagesService) {
            var _this = this;
            this.prisma = prisma;
            this.authService = authService;
            this.packagesService = packagesService;
            this.generateUniqueCustomID = function (user) { return __awaiter(_this, void 0, void 0, function () {
                var customID, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, generate_id_1.default)(user)];
                        case 1:
                            customID = _a.sent();
                            return [4 /*yield*/, this.prisma.order.findUnique({
                                    where: { trackingId: customID },
                                })];
                        case 2:
                            exists = _a.sent();
                            if (exists) {
                                // If customID already exists, recursively call itself to generate a new one
                                return [2 /*return*/, this.generateUniqueCustomID(user)];
                            }
                            return [2 /*return*/, customID]; // Return unique customID
                    }
                });
            }); };
        }
        OrdersService_1.prototype.create = function (userToken, createOrderDto) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var orderData, user, data, customID, createdOrder, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            orderData = (0, class_transformer_1.plainToClass)(create_order_dto_1.CreateOrderDto, createOrderDto);
                            user = void 0;
                            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.createdByUserId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: orderData === null || orderData === void 0 ? void 0 : orderData.createdByUserId },
                                })];
                        case 1:
                            user = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.authService.getAuthUser(userToken)];
                        case 3:
                            data = _b.sent();
                            user = data === null || data === void 0 ? void 0 : data.user;
                            _b.label = 4;
                        case 4: return [4 /*yield*/, this.generateUniqueCustomID(user)];
                        case 5:
                            customID = _b.sent();
                            console.log("ORDER DATA TO CREATE ===>", JSON.stringify(orderData, null, 2));
                            console.log("USER USED ===>", user === null || user === void 0 ? void 0 : user.id);
                            return [4 /*yield*/, this.prisma.order.create({
                                    data: __assign(__assign({}, orderData), { trackingId: customID, createdByUserId: (orderData === null || orderData === void 0 ? void 0 : orderData.createdByUserId)
                                            ? orderData === null || orderData === void 0 ? void 0 : orderData.createdByUserId
                                            : user === null || user === void 0 ? void 0 : user.id, source: {
                                            create: orderData === null || orderData === void 0 ? void 0 : orderData.source,
                                        }, recipient: {
                                            create: orderData === null || orderData === void 0 ? void 0 : orderData.recipient,
                                        }, packages: {
                                            create: (_a = orderData === null || orderData === void 0 ? void 0 : orderData.packages) === null || _a === void 0 ? void 0 : _a.map(function (packageData) {
                                                var _a;
                                                return (__assign(__assign({}, packageData), { references: {
                                                        create: (_a = packageData === null || packageData === void 0 ? void 0 : packageData.references) === null || _a === void 0 ? void 0 : _a.map(function (referenceData) { return referenceData; }),
                                                    } }));
                                            }),
                                        } }),
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: {
                                                references: true,
                                            },
                                        },
                                        pods: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                })];
                        case 6:
                            createdOrder = _b.sent();
                            return [2 /*return*/, createdOrder];
                        case 7:
                            error_1 = _b.sent();
                            console.error(error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                            throw new common_1.HttpException((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Erreur lors de la création', error_1.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.generateInvoiceAutomatically = function (order) {
            return __awaiter(this, void 0, void 0, function () {
                var providerId_1, from_1, to_1, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            providerId_1 = order.createdByUserId;
                            from_1 = order.startTransitAt;
                            to_1 = order.deliveredAt;
                            // 👉 call your existing logic
                            return [4 /*yield*/, this.prisma.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                    var userService;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                userService = new (require('../user/user.service').UserService)(prisma, null);
                                                return [4 /*yield*/, userService.getProvidersInvoice(providerId_1, from_1, to_1, 3, {
                                                        status: function () { return ({ json: function () { } }); },
                                                        setHeader: function () { },
                                                        send: function () { },
                                                    })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            // 👉 call your existing logic
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.error("Auto invoice error:", error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.findAll = function (userToken, page, limit, trackingId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var orders, totalCount, user, offset, conditions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orders = [];
                            totalCount = 0;
                            return [4 /*yield*/, this.authService.getAuthUser(userToken)];
                        case 1:
                            user = (_a.sent()).user;
                            offset = (page - 1) * limit;
                            conditions = {};
                            if (trackingId !== 'null') {
                                conditions = __assign(__assign({}, conditions), { trackingId: trackingId });
                            }
                            if (status !== 'null') {
                                conditions = __assign(__assign({}, conditions), { orderStatusId: parseInt(status) });
                            }
                            if (!((user === null || user === void 0 ? void 0 : user.roleId) === 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.order.count({ where: conditions })];
                        case 2:
                            // ADMIN : voit toutes les commandes
                            totalCount = _a.sent();
                            return [4 /*yield*/, this.prisma.order.findMany({
                                    where: conditions,
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: { references: true },
                                        },
                                        deliveredBy: {
                                            include: {
                                                disponibility: true,
                                                carType: true,
                                            },
                                        },
                                        pods: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                    skip: offset,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 3:
                            orders = _a.sent();
                            return [3 /*break*/, 10];
                        case 4:
                            if (!((user === null || user === void 0 ? void 0 : user.roleId) === 3)) return [3 /*break*/, 7];
                            // CLIENT : commandes qu'il a créées
                            conditions = __assign(__assign({}, conditions), { createdByUserId: user.id });
                            return [4 /*yield*/, this.prisma.order.count({ where: conditions })];
                        case 5:
                            totalCount = _a.sent();
                            return [4 /*yield*/, this.prisma.order.findMany({
                                    where: conditions,
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: { references: true },
                                        },
                                        deliveredBy: {
                                            include: {
                                                disponibility: true,
                                                carType: true,
                                            },
                                        },
                                        pods: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                    skip: offset,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 6:
                            orders = _a.sent();
                            return [3 /*break*/, 10];
                        case 7:
                            if (!((user === null || user === void 0 ? void 0 : user.roleId) === 2)) return [3 /*break*/, 10];
                            // TRANSPORTEUR : commandes qui lui sont assignées
                            conditions = __assign(__assign({}, conditions), { deliveredByUserId: user.id });
                            return [4 /*yield*/, this.prisma.order.count({ where: conditions })];
                        case 8:
                            totalCount = _a.sent();
                            return [4 /*yield*/, this.prisma.order.findMany({
                                    where: conditions,
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: { references: true },
                                        },
                                        deliveredBy: {
                                            include: {
                                                disponibility: true,
                                                carType: true,
                                            },
                                        },
                                        pods: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                    skip: offset,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 9:
                            orders = _a.sent();
                            _a.label = 10;
                        case 10: return [4 /*yield*/, (orders === null || orders === void 0 ? void 0 : orders.map(function (el) {
                                var _a;
                                (_a = el === null || el === void 0 ? void 0 : el.deliveredBy) === null || _a === void 0 ? true : delete _a.password;
                                return el;
                            }))];
                        case 11:
                            orders = _a.sent();
                            return [2 /*return*/, { orders: orders, totalCount: totalCount }];
                    }
                });
            });
        };
        OrdersService_1.prototype.findOne = function (id) {
            return this.prisma.order.findUnique({
                where: { id: id },
                include: {
                    source: true,
                    recipient: true,
                    packages: {
                        include: {
                            references: true,
                        },
                    },
                    pods: true,
                    clientPriceStatus: true,
                    transporterPriceStatus: true,
                },
            });
        };
        OrdersService_1.prototype.findOrder = function (id) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var order;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                                where: { trackingId: id },
                                include: {
                                    source: true,
                                    recipient: true,
                                    packages: {
                                        include: {
                                            references: true,
                                        },
                                    },
                                    pods: true,
                                    deliveredBy: true,
                                    clientPriceStatus: true,
                                    transporterPriceStatus: true,
                                },
                            })];
                        case 1:
                            order = _c.sent();
                            (_a = order === null || order === void 0 ? void 0 : order.deliveredBy) === null || _a === void 0 ? true : delete _a.password;
                            (_b = order === null || order === void 0 ? void 0 : order.deliveredBy) === null || _b === void 0 ? true : delete _b.resetPasswordToken;
                            return [2 /*return*/, order];
                    }
                });
            });
        };
        OrdersService_1.prototype.update2 = function (id, updateOrderDto) {
            return __awaiter(this, void 0, void 0, function () {
                var source, recipient, packages, orderData, updatedOrder, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            source = updateOrderDto.source, recipient = updateOrderDto.recipient, packages = updateOrderDto.packages, orderData = __rest(updateOrderDto, ["source", "recipient", "packages"]);
                            if (!id) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.order.update({
                                    where: { id: id },
                                    data: __assign(__assign({}, orderData), { source: source
                                            ? {
                                                update: {
                                                    where: { orderId: id }, // Correct where clause for source update
                                                    data: source,
                                                },
                                            }
                                            : undefined, recipient: recipient
                                            ? {
                                                update: {
                                                    where: { orderId: id }, // Correct where clause for recipient update
                                                    data: recipient,
                                                },
                                            }
                                            : undefined, packages: packages
                                            ? {
                                                update: packages === null || packages === void 0 ? void 0 : packages.map(function (pkg) {
                                                    var _a;
                                                    return ({
                                                        where: { id: pkg === null || pkg === void 0 ? void 0 : pkg.id },
                                                        data: __assign(__assign({}, pkg), { references: (pkg === null || pkg === void 0 ? void 0 : pkg.references)
                                                                ? {
                                                                    update: (_a = pkg === null || pkg === void 0 ? void 0 : pkg.references) === null || _a === void 0 ? void 0 : _a.map(function (ref) { return ({
                                                                        where: { id: ref === null || ref === void 0 ? void 0 : ref.id },
                                                                        data: ref,
                                                                    }); }),
                                                                }
                                                                : undefined }),
                                                    });
                                                }),
                                            }
                                            : undefined }),
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: {
                                                references: true,
                                            },
                                        },
                                        pods: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                })];
                        case 1:
                            updatedOrder = _a.sent();
                            return [2 /*return*/, updatedOrder];
                        case 2: throw new common_1.HttpException('Undefined Order ID !', 400);
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            error_3 = _a.sent();
                            console.error(error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                            return [2 /*return*/, new common_1.HttpException(error_3 === null || error_3 === void 0 ? void 0 : error_3.message, 400)];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.update = function (id, updateOrderDto) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var source, recipient, packages_2, orderData, orderExists, existsPackages, existingPackageIds, packagesToDelete, _i, packagesToDelete_1, pkg, _b, packages_1, pkg, newPkg, updatedOrder, error_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 15, , 16]);
                            source = updateOrderDto.source, recipient = updateOrderDto.recipient, packages_2 = updateOrderDto.packages, orderData = __rest(updateOrderDto, ["source", "recipient", "packages"]);
                            return [4 /*yield*/, this.prisma.order.findUnique({
                                    where: { id: id },
                                })];
                        case 1:
                            orderExists = _c.sent();
                            if (!orderExists) {
                                throw new common_1.HttpException('Order not found', 404);
                            }
                            return [4 /*yield*/, this.prisma.order_packages.findMany({
                                    where: {
                                        orderId: id,
                                    },
                                })];
                        case 2:
                            existsPackages = _c.sent();
                            if (!packages_2) return [3 /*break*/, 12];
                            existingPackageIds = existsPackages === null || existsPackages === void 0 ? void 0 : existsPackages.map(function (pkg) { return pkg.id; });
                            packagesToDelete = existsPackages === null || existsPackages === void 0 ? void 0 : existsPackages.filter(function (pkg) {
                                return !packages_2.some(function (updatePkg) { return (updatePkg === null || updatePkg === void 0 ? void 0 : updatePkg.id) === (pkg === null || pkg === void 0 ? void 0 : pkg.id); });
                            });
                            _i = 0, packagesToDelete_1 = packagesToDelete;
                            _c.label = 3;
                        case 3:
                            if (!(_i < packagesToDelete_1.length)) return [3 /*break*/, 6];
                            pkg = packagesToDelete_1[_i];
                            return [4 /*yield*/, this.prisma.order_packages.delete({
                                    where: {
                                        id: pkg === null || pkg === void 0 ? void 0 : pkg.id,
                                    },
                                })];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            _b = 0, packages_1 = packages_2;
                            _c.label = 7;
                        case 7:
                            if (!(_b < packages_1.length)) return [3 /*break*/, 12];
                            pkg = packages_1[_b];
                            if (((_a = pkg === null || pkg === void 0 ? void 0 : pkg.references) === null || _a === void 0 ? void 0 : _a.length) === 0 || (pkg === null || pkg === void 0 ? void 0 : pkg.references) === undefined) {
                                pkg === null || pkg === void 0 ? true : delete pkg.references;
                            }
                            if (!(pkg.id && existingPackageIds.includes(pkg === null || pkg === void 0 ? void 0 : pkg.id))) return [3 /*break*/, 9];
                            // Update package
                            return [4 /*yield*/, this.packagesService.update(pkg === null || pkg === void 0 ? void 0 : pkg.id, pkg)];
                        case 8:
                            // Update package
                            _c.sent();
                            return [3 /*break*/, 11];
                        case 9:
                            newPkg = __assign(__assign({}, pkg), { orderId: id });
                            return [4 /*yield*/, this.packagesService.create(newPkg)];
                        case 10:
                            _c.sent();
                            _c.label = 11;
                        case 11:
                            _b++;
                            return [3 /*break*/, 7];
                        case 12: 
                        // Update order references
                        return [4 /*yield*/, this.prisma.order.update({
                                where: { id: id },
                                data: {
                                    refrences: undefined,
                                },
                            })];
                        case 13:
                            // Update order references
                            _c.sent();
                            return [4 /*yield*/, this.prisma.order.update({
                                    where: { id: id },
                                    data: __assign(__assign({}, orderData), { source: source
                                            ? {
                                                update: {
                                                    where: { orderId: id }, // Correct where clause for source update
                                                    data: source,
                                                },
                                            }
                                            : undefined, recipient: recipient
                                            ? {
                                                update: {
                                                    where: { orderId: id }, // Correct where clause for recipient update
                                                    data: recipient,
                                                },
                                            }
                                            : undefined }),
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: {
                                                references: true,
                                            },
                                        },
                                        pods: true,
                                        deliveredBy: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                })];
                        case 14:
                            updatedOrder = _c.sent();
                            return [2 /*return*/, updatedOrder];
                        case 15:
                            error_4 = _c.sent();
                            console.error(error_4 === null || error_4 === void 0 ? void 0 : error_4.message);
                            return [2 /*return*/, new common_1.HttpException(error_4 === null || error_4 === void 0 ? void 0 : error_4.message, error_4.status || 400)];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.updateOrderTransporter = function (id, updateOrderDto) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var deliveredByUserId, updatedOrder, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            deliveredByUserId = updateOrderDto.deliveredByUserId;
                            return [4 /*yield*/, this.prisma.order.update({
                                    where: { id: id },
                                    data: {
                                        deliveredByUserId: deliveredByUserId,
                                        orderStatusId: deliveredByUserId ? 2 : 1,
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
                                        deliveredBy: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                })];
                        case 1:
                            updatedOrder = _b.sent();
                            (_a = updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.deliveredBy) === null || _a === void 0 ? true : delete _a.password;
                            return [2 /*return*/, updatedOrder];
                        case 2:
                            error_5 = _b.sent();
                            console.error(error_5 === null || error_5 === void 0 ? void 0 : error_5.message);
                            return [2 /*return*/, new common_1.HttpException(error_5 === null || error_5 === void 0 ? void 0 : error_5.message, 400)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        OrdersService_1.prototype.updateOrderStatus = function (id, orderData) {
            return __awaiter(this, void 0, void 0, function () {
                var data, updatedOrder, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = __assign({}, orderData);
                            if (!(data === null || data === void 0 ? void 0 : data.orderStatusId)) {
                                data = { orderStatusId: 1 };
                            }
                            if ((data === null || data === void 0 ? void 0 : data.orderStatusId) == 3) {
                                data = __assign(__assign({}, data), { startTransitAt: new Date() });
                            }
                            if ((data === null || data === void 0 ? void 0 : data.orderStatusId) == 4) {
                                data = __assign(__assign({}, data), { deliveredAt: new Date() });
                            }
                            return [4 /*yield*/, this.prisma.order.update({
                                    where: { id: id },
                                    data: data,
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: {
                                                references: true,
                                            },
                                        },
                                        pods: true,
                                        deliveredBy: true,
                                        clientPriceStatus: true,
                                        transporterPriceStatus: true,
                                    },
                                })];
                        case 1:
                            updatedOrder = _a.sent();
                            if (!(updatedOrder.orderStatusId == 4)) return [3 /*break*/, 5];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.generateInvoiceAutomatically(updatedOrder)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_6 = _a.sent();
                            console.error("Invoice generation failed:", error_6);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, updatedOrder];
                    }
                });
            });
        };
        OrdersService_1.prototype.togglePaymentRequired = function (orderId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.order.update({
                            where: { id: orderId },
                            data: {
                                paymentRequired: true,
                                paymentAmount: dto.amount,
                                paymentStatus: 'pending'
                            }
                        })];
                });
            });
        };
        OrdersService_1.prototype.markPaid = function (orderId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.order.update({
                            where: { id: orderId },
                            data: { paymentStatus: 'paid' }
                        })];
                });
            });
        };
        OrdersService_1.prototype.remove = function (id) {
            return this.prisma.order.delete({ where: { id: id } });
        };
        return OrdersService_1;
    }());
    __setFunctionName(_classThis, "OrdersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersService = _classThis;
}();
exports.OrdersService = OrdersService;
