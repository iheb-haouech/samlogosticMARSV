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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var create_user_dto_1 = require("./dto/create-user.dto");
var bcrypt = require("bcryptjs");
var class_transformer_1 = require("class-transformer");
var handlebars = require("handlebars");
var pdf = require("html-pdf");
var path = require("path");
var fs = require("fs");
var generate_facture_id_1 = require("../utils/generate-facture-id");
var UserService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UserService = _classThis = /** @class */ (function () {
        function UserService_1(prisma, mailerService) {
            this.prisma = prisma;
            this.mailerService = mailerService;
        }
        UserService_1.prototype.create = function (createUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                var exist, userData, hashedPassword, createdUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: createUserDto === null || createUserDto === void 0 ? void 0 : createUserDto.email },
                            })];
                        case 1:
                            exist = _a.sent();
                            if (exist) {
                                throw new common_1.NotFoundException('User already registered !');
                            }
                            userData = (0, class_transformer_1.plainToClass)(create_user_dto_1.UserDTO, createUserDto);
                            return [4 /*yield*/, bcrypt.hash(userData.password, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            userData = __assign(__assign({}, userData), { password: hashedPassword });
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: __assign(__assign({}, userData), { disponibility: (userData === null || userData === void 0 ? void 0 : userData.disponibility)
                                            ? {
                                                create: userData === null || userData === void 0 ? void 0 : userData.disponibility,
                                            }
                                            : undefined }),
                                    include: {
                                        disponibility: true,
                                    },
                                })];
                        case 3:
                            createdUser = _a.sent();
                            createdUser === null || createdUser === void 0 ? true : delete createdUser.password;
                            return [2 /*return*/, createdUser];
                    }
                });
            });
        };
        UserService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var users, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findMany()];
                        case 1:
                            users = _a.sent();
                            return [4 /*yield*/, (users === null || users === void 0 ? void 0 : users.map(function (user) { return user === null || user === void 0 ? true : delete user.password; }))];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        UserService_1.prototype.findAllProviders = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, verified, email, conditions, totalCount, providers;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, verified = query.verified, email = query.email;
                            conditions = {
                                roleId: 3,
                            };
                            // Add verified condition
                            if (verified !== undefined) {
                                conditions.verified = verified === 'true';
                            }
                            // Add email condition
                            if (email) {
                                conditions.email = { contains: email };
                            }
                            return [4 /*yield*/, this.prisma.user.count({
                                    where: __assign({}, conditions),
                                })];
                        case 1:
                            totalCount = _c.sent();
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: conditions,
                                    skip: (page - 1) * parseInt(limit), // Calculate skip value
                                    take: parseInt(limit),
                                })];
                        case 2:
                            providers = _c.sent();
                            providers = providers === null || providers === void 0 ? void 0 : providers.map(function (provider) {
                                provider === null || provider === void 0 ? true : delete provider.password;
                                provider === null || provider === void 0 ? true : delete provider.resetPasswordToken;
                                return provider;
                            });
                            // Return the result
                            console.log({
                                totalCount: totalCount,
                                providers: providers,
                            });
                            return [2 /*return*/, {
                                    totalCount: totalCount,
                                    providers: providers,
                                }];
                    }
                });
            });
        };
        UserService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: id },
                                include: {
                                    createOrders: true,
                                    deliverOrders: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User Not Found !');
                            }
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        UserService_1.prototype.findProviderOrders = function (id) {
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
                                    createOrders: {
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
                            user === null || user === void 0 ? true : delete user.password;
                            user === null || user === void 0 ? true : delete user.resetPasswordToken;
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        UserService_1.prototype.getAllInvoices = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, from, to, userId;
                return __generator(this, function (_b) {
                    _a = query || {}, from = _a.from, to = _a.to, userId = _a.userId;
                    return [2 /*return*/, this.prisma.order_invoice.findMany({
                            where: __assign(__assign({}, (userId && { generatedFor: Number(userId) })), (from && to && {
                                createdAt: {
                                    gte: new Date(from),
                                    lte: new Date(to),
                                },
                            })),
                            orderBy: { createdAt: "desc" },
                        })];
                });
            });
        };
        UserService_1.prototype.findUserOrdersInvoices = function (id, page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 12; }
            return __awaiter(this, void 0, void 0, function () {
                var skip, invoices, totalCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.prisma.order_invoice.findMany({
                                    where: {
                                        generatedFor: id,
                                    },
                                    include: {
                                        orders: true,
                                    },
                                    skip: skip,
                                    take: limit,
                                })];
                        case 1:
                            invoices = _a.sent();
                            return [4 /*yield*/, this.prisma.order_invoice.count({
                                    where: {
                                        generatedFor: id,
                                    },
                                })];
                        case 2:
                            totalCount = _a.sent();
                            return [2 /*return*/, {
                                    invoices: invoices,
                                    totalCount: totalCount,
                                    currentPage: page,
                                    totalPages: Math.ceil(totalCount / limit),
                                }];
                    }
                });
            });
        };
        UserService_1.prototype.updateUserDisponibility = function (id, userDto) {
            return __awaiter(this, void 0, void 0, function () {
                var disponibility, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            disponibility = userDto.disponibility;
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: id },
                                    data: {
                                        disponibility: {
                                            update: disponibility,
                                        },
                                    },
                                    include: {
                                        disponibility: true,
                                    },
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        UserService_1.prototype.updateUser = function (id, userDto) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedPassword, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(userDto === null || userDto === void 0 ? void 0 : userDto.password)) return [3 /*break*/, 2];
                            return [4 /*yield*/, bcrypt.hash(userDto === null || userDto === void 0 ? void 0 : userDto.password, 10)];
                        case 1:
                            hashedPassword = _a.sent();
                            userDto = __assign(__assign({}, userDto), { password: hashedPassword });
                            return [3 /*break*/, 3];
                        case 2:
                            delete userDto.password;
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: id },
                                data: __assign(__assign({}, userDto), { disponibility: (userDto === null || userDto === void 0 ? void 0 : userDto.disponibility)
                                        ? {
                                            update: userDto === null || userDto === void 0 ? void 0 : userDto.disponibility,
                                        }
                                        : undefined }),
                                include: {
                                    disponibility: true,
                                },
                            })];
                        case 4:
                            data = _a.sent();
                            data === null || data === void 0 ? true : delete data.password;
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        UserService_1.prototype.verifie = function (id) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var updatedUser, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: id },
                                data: {
                                    verified: true,
                                },
                                include: {
                                    disponibility: true,
                                },
                            })];
                        case 1:
                            updatedUser = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.mailerService.sendMail({
                                    to: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                                    from: process.env.MAIL_FROM, // override default from
                                    subject: 'Welcome to Vanlog-express! Your Account is Approved',
                                    template: './user_verified',
                                    context: {
                                        companyName: (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.companyName)
                                            ? updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.companyName
                                            : 'User',
                                        loginUrl: "".concat(process.env.FRONTEND_URL, "/login"),
                                        year: "".concat((_a = new Date()) === null || _a === void 0 ? void 0 : _a.getFullYear()),
                                    },
                                })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            console.log('cannot send email to verify user !!!');
                            return [3 /*break*/, 5];
                        case 5:
                            updatedUser === null || updatedUser === void 0 ? true : delete updatedUser.password;
                            updatedUser === null || updatedUser === void 0 ? true : delete updatedUser.resetPasswordToken;
                            return [2 /*return*/, updatedUser];
                    }
                });
            });
        };
        UserService_1.prototype.removeUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user, deletedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.HttpException('User not found !', 400);
                            return [4 /*yield*/, this.prisma.user.delete({ where: { id: id } })];
                        case 2:
                            deletedUser = _a.sent();
                            deletedUser === null || deletedUser === void 0 ? true : delete deletedUser.password;
                            return [2 /*return*/, deletedUser];
                    }
                });
            });
        };
        UserService_1.prototype.calcTVA = function (pourcentage, priceClient, priceTransporter, invoiceType) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (invoiceType === 3) {
                        return [2 /*return*/, ((pourcentage / 100) * priceClient).toFixed(2)];
                    }
                    else if (invoiceType === 4) {
                        return [2 /*return*/, ((pourcentage / 100) * priceTransporter).toFixed(2)];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        };
        UserService_1.prototype.calcTTC = function (tva, priceClient, priceTransporter, invoiceType) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (invoiceType === 3) {
                        return [2 /*return*/, tva + priceClient];
                    }
                    else if (invoiceType === 4) {
                        return [2 /*return*/, tva + priceTransporter];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
                });
            });
        };
        UserService_1.prototype.generatePdf = function (data, template_name, saved_file_name, save) {
            if (save === void 0) { save = false; }
            return __awaiter(this, void 0, void 0, function () {
                var htmlPath, html, template, compiledHtml_1, pdfBuffer, filePath, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            htmlPath = path.join(__dirname, '../../templates', template_name);
                            html = fs.readFileSync(htmlPath, 'utf-8');
                            template = handlebars.compile(html);
                            compiledHtml_1 = template(data);
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    pdf.create(compiledHtml_1).toBuffer(function (err, buffer) {
                                        if (err) {
                                            console.error('PDF Creation Error:', err);
                                            reject(err);
                                        }
                                        else {
                                            resolve(buffer);
                                        }
                                    });
                                })];
                        case 1:
                            pdfBuffer = _a.sent();
                            // Save generated PDF buffer in pdf file if save is true
                            if (save) {
                                filePath = path.join(__dirname, '../../../generatedFiles', saved_file_name);
                            }
                            return [2 /*return*/, pdfBuffer];
                        case 2:
                            error_2 = _a.sent();
                            console.error('Error generating PDF:', error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UserService_1.prototype.formatDate = function (date) {
            if (!date)
                return null; // Handle null/undefined cases
            var d = new Date(date);
            if (isNaN(d.getTime()))
                return null; // Handle invalid dates
            return d.toISOString().split('T')[0].split('-').reverse().join('-');
            // Converts '2025-02-13' → '13-02-2025'
        };
        UserService_1.prototype.generateInvoiceData = function (providerId, from, to, invoiceType) {
            return __awaiter(this, void 0, void 0, function () {
                var user, conditions, userType, orders, totalHt, tva, ttc, net;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: providerId },
                            })];
                        case 1:
                            user = _a.sent();
                            conditions = {};
                            userType = "";
                            if ((user === null || user === void 0 ? void 0 : user.roleId) == 3) {
                                conditions.createdByUserId = providerId;
                                userType = "Client";
                            }
                            else if ((user === null || user === void 0 ? void 0 : user.roleId) == 2) {
                                conditions.deliveredByUserId = providerId;
                                userType = "Transporteur";
                            }
                            if (from)
                                conditions.startTransitAt = { gte: new Date(from) };
                            if (to)
                                conditions.deliveredAt = { lte: new Date(to) };
                            return [4 /*yield*/, this.prisma.order.findMany({
                                    where: __assign({ orderStatusId: { in: [3, 4] } }, conditions),
                                })];
                        case 2:
                            orders = _a.sent();
                            if (!orders.length)
                                return [2 /*return*/, null];
                            totalHt = orders.reduce(function (sum, o) { return sum + (+o.clientPrice || 0); }, 0);
                            tva = (totalHt * 0.07).toFixed(3);
                            ttc = (parseFloat(tva) + totalHt).toFixed(3);
                            net = (parseFloat(ttc) + 1).toFixed(3);
                            return [2 /*return*/, {
                                    user: user,
                                    orders: orders,
                                    totalHt: totalHt,
                                    tva: tva,
                                    ttc: ttc,
                                    net: net,
                                    userType: userType,
                                    from: from,
                                    to: to,
                                }];
                    }
                });
            });
        };
        UserService_1.prototype.generateInvoicePdf = function (userId, from, to, type) {
            return __awaiter(this, void 0, void 0, function () {
                var data, template;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.generateInvoiceData(userId, from, to, type)];
                        case 1:
                            data = _a.sent();
                            if (!data) {
                                throw new Error("No data found for this invoice");
                            }
                            template = type == 3 ? "facture-client.hbs" : "facture-transporteur.hbs";
                            return [2 /*return*/, this.generatePdf(data, template, "invoice.pdf")];
                    }
                });
            });
        };
        UserService_1.prototype.getProvidersInvoice = function (providerId, from, to, invoiceType, res) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function () {
                var user, userType, conditions, orders, timbreFiscale, template_name, saved_file_name, totalOrdersClientPrice, totalOrdersTransporterPrice, tva, _f, ttc, _g, net, existingInvoice, generatedInvoice, existingOrderIds_1, newOrders, allOrders, totalHt, tva_1, _h, ttc_1, _j, net_1, genMatricule, pdfBuffer, error_3;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _k.trys.push([0, 16, , 17]);
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: providerId },
                                })];
                        case 1:
                            user = _k.sent();
                            console.log('providerId', { providerId: providerId, from: from, to: to });
                            userType = null;
                            conditions = {};
                            // Determine the user type and set conditions based on the user's role
                            if ((user === null || user === void 0 ? void 0 : user.roleId) == 3) {
                                conditions.createdByUserId = providerId; // Filter orders created by the client
                                userType = 'Client';
                            }
                            else if ((user === null || user === void 0 ? void 0 : user.roleId) == 2) {
                                conditions.deliveredByUserId = providerId; // Filter orders delivered by the transporter
                                userType = 'Transporteur';
                            }
                            // Add date range filters if provided
                            if (from) {
                                conditions.startTransitAt = { gte: new Date(from) }; // Orders starting on or after `from`
                            }
                            if (to) {
                                conditions.deliveredAt = { lte: new Date(to) }; // Orders delivered on or before `to`
                            }
                            return [4 /*yield*/, this.prisma.order.findMany({
                                    where: __assign({ orderStatusId: { in: [3, 4] } }, conditions),
                                })];
                        case 2:
                            orders = _k.sent();
                            // If no orders are found, return a 404 error
                            if (!orders.length) {
                                return [2 /*return*/, res
                                        .status(404)
                                        .json({ message: 'No orders found for the given criteria' })];
                            }
                            timbreFiscale = 1.0;
                            template_name = invoiceType == 3 ? 'facture-client.hbs' : 'facture-transporteur.hbs';
                            saved_file_name = 'output.pdf';
                            totalOrdersClientPrice = orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.clientPrice) || 0); }, 0);
                            totalOrdersTransporterPrice = orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.transporterPrice) || 0); }, 0);
                            _f = parseFloat;
                            return [4 /*yield*/, this.calcTVA(7, // VAT rate (7%)
                                totalOrdersClientPrice, totalOrdersTransporterPrice, invoiceType)];
                        case 3:
                            tva = _f.apply(void 0, [_k.sent()]).toFixed(3);
                            _g = parseFloat;
                            return [4 /*yield*/, this.calcTTC(parseFloat(tva), totalOrdersClientPrice, totalOrdersTransporterPrice, invoiceType)];
                        case 4:
                            ttc = _g.apply(void 0, [_k.sent()]).toFixed(3);
                            net = (parseFloat(ttc) + timbreFiscale).toFixed(3);
                            return [4 /*yield*/, this.prisma.order_invoice.findFirst({
                                    where: { generatedFor: providerId, from: from, to: to, invoiceType: invoiceType },
                                    include: { orders: true }, // Include associated orders
                                })];
                        case 5:
                            existingInvoice = _k.sent();
                            generatedInvoice = void 0;
                            if (!existingInvoice) return [3 /*break*/, 11];
                            existingOrderIds_1 = new Set(existingInvoice.orders.map(function (o) { return o.id; }));
                            newOrders = orders.filter(function (o) { return !existingOrderIds_1.has(o.id); });
                            if (!(newOrders.length > 0)) return [3 /*break*/, 9];
                            allOrders = __spreadArray(__spreadArray([], existingInvoice.orders, true), newOrders, true);
                            totalHt = allOrders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.clientPrice) || 0); }, 0);
                            _h = parseFloat;
                            return [4 /*yield*/, this.calcTVA(7, totalHt, totalOrdersTransporterPrice, invoiceType)];
                        case 6:
                            tva_1 = _h.apply(void 0, [_k.sent()]).toFixed(3);
                            _j = parseFloat;
                            return [4 /*yield*/, this.calcTTC(parseFloat(tva_1), totalHt, totalOrdersTransporterPrice, invoiceType)];
                        case 7:
                            ttc_1 = _j.apply(void 0, [_k.sent()]).toFixed(3);
                            net_1 = (parseFloat(ttc_1) + timbreFiscale).toFixed(3);
                            return [4 /*yield*/, this.prisma.order_invoice.update({
                                    where: { id: existingInvoice.id },
                                    data: {
                                        totalHt: parseFloat("".concat(totalHt)),
                                        tva: parseFloat(tva_1),
                                        ttc: parseFloat(ttc_1),
                                        timbreFiscale: timbreFiscale,
                                        net: parseFloat(net_1),
                                        orders: { connect: newOrders.map(function (o) { return ({ id: o.id }); }) }, // Connect new orders to the invoice
                                    },
                                })];
                        case 8:
                            // Update the existing invoice with new orders and recalculated totals
                            generatedInvoice = _k.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            // If no new orders are found, return the existing invoice
                            generatedInvoice = existingInvoice;
                            _k.label = 10;
                        case 10: return [3 /*break*/, 14];
                        case 11: return [4 /*yield*/, (0, generate_facture_id_1.default)(this.prisma)];
                        case 12:
                            genMatricule = _k.sent();
                            return [4 /*yield*/, this.prisma.order_invoice.create({
                                    data: {
                                        matricule: genMatricule, // Unique invoice number
                                        totalHt: totalOrdersClientPrice, // Total HT (excluding VAT)
                                        tva: parseFloat(tva), // VAT amount
                                        ttc: parseFloat(ttc), // Total including VAT
                                        timbreFiscale: timbreFiscale, // Stamp duty
                                        net: parseFloat(net), // Net amount (TTC + stamp duty)
                                        invoiceType: invoiceType, // Invoice type (client or transporter)
                                        generatedBy: null, // ID of the user generating the invoice
                                        generatedFor: providerId, // ID of the provider
                                        from: from, // Start date of the invoice period
                                        to: to, // End date of the invoice period
                                        orders: { connect: orders.map(function (o) { return ({ id: o.id }); }) }, // Connect orders to the invoice
                                    },
                                })];
                        case 13:
                            // Create a new invoice
                            generatedInvoice = _k.sent();
                            _k.label = 14;
                        case 14: return [4 /*yield*/, this.generatePdf({
                                userType: userType, // User type (Client or Transporteur)
                                orders: orders, // List of orders
                                from: "".concat((_a = this.formatDate(from)) === null || _a === void 0 ? void 0 : _a.split('T')[0]), // Formatted start date
                                to: "".concat((_b = this.formatDate(to)) === null || _b === void 0 ? void 0 : _b.split('T')[0]), // Formatted end date
                                provider: __assign(__assign({}, user), { firstName: (_c = user === null || user === void 0 ? void 0 : user.firstName) === null || _c === void 0 ? void 0 : _c.toUpperCase(), lastName: (_d = user === null || user === void 0 ? void 0 : user.lastName) === null || _d === void 0 ? void 0 : _d.toUpperCase(), companyName: (_e = user === null || user === void 0 ? void 0 : user.companyName) === null || _e === void 0 ? void 0 : _e.toUpperCase() }), // Provider details
                                ordersLength: orders.length, // Number of orders
                                totalWeight: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalWeight) || 0); }, 0), // Total weight of all orders
                                totalQuantity: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalQuantity) || 0); }, 0), // Total quantity of all orders
                                totalOrdersPrice: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalPrice) || 0); }, 0), // Total price of all orders
                                totalOrdersClientPrice: totalOrdersClientPrice, // Total client price
                                totalOrdersTransporterPrice: totalOrdersTransporterPrice, // Total transporter price
                                totalHeight: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalHeight) || 0); }, 0), // Total height of all orders
                                totalWidth: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalWidth) || 0); }, 0), // Total width of all orders
                                totalLength: orders.reduce(function (sum, ord) { return sum + (+(ord === null || ord === void 0 ? void 0 : ord.totalLength) || 0); }, 0), // Total length of all orders
                                tva: tva, // VAT amount
                                ttc: ttc, // Total including VAT
                                timbreFiscale: parseFloat("".concat(timbreFiscale)).toFixed(3), // Stamp duty
                                net: net, // Net amount
                                generatedInvoice: __assign(__assign({}, generatedInvoice), { createdAt: this.formatDate(generatedInvoice === null || generatedInvoice === void 0 ? void 0 : generatedInvoice.createdAt), from: this.formatDate(generatedInvoice === null || generatedInvoice === void 0 ? void 0 : generatedInvoice.from), to: this.formatDate(generatedInvoice === null || generatedInvoice === void 0 ? void 0 : generatedInvoice.to) }), // Invoice details
                            }, template_name, // Template name
                            saved_file_name, // Output file name
                            false)];
                        case 15:
                            pdfBuffer = _k.sent();
                            // Set the response headers and send the PDF
                            res.setHeader('Content-Type', 'application/pdf');
                            return [2 /*return*/, res.send(pdfBuffer)];
                        case 16:
                            error_3 = _k.sent();
                            // Handle errors and return a 500 status code
                            console.error(error_3);
                            return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error' })];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        return UserService_1;
    }());
    __setFunctionName(_classThis, "UserService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
}();
exports.UserService = UserService;
