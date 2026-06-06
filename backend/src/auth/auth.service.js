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
exports.AuthService = void 0;
//src/auth/auth.service.ts
var common_1 = require("@nestjs/common");
var bcrypt = require("bcryptjs");
var enum_1 = require("../utils/enum");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
        }
        AuthService_1.prototype.getAdminTransporters = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findMany({
                            where: {
                                roleId: enum_1.USERROLES.transporter.id,
                                verified: true
                            },
                            select: {
                                id: true, firstName: true, lastName: true,
                                email: true, vehicleNumber: true,
                                vehicleSize: true, maxWeightKg: true
                            }
                        })];
                });
            });
        };
        AuthService_1.prototype.generateTokens = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var accessToken, refreshToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.jwtService.sign(payload)];
                        case 1:
                            accessToken = _a.sent();
                            return [4 /*yield*/, this.jwtService.sign(payload, {
                                    secret: process.env.JWT_REFRESH_SECRET,
                                    expiresIn: process.env.JWT_REFRESH_EXP_IN,
                                })];
                        case 2:
                            refreshToken = _a.sent();
                            return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid, _a, accessToken, refreshToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email } })];
                        case 1:
                            user = _b.sent();
                            // If no user is found, throw an error
                            if (!user) {
                                throw new common_1.NotFoundException("No user found for email: ".concat(email));
                            }
                            if (!user.verified && user.roleId === 3) {
                                throw new common_1.UnauthorizedException('Votre email n’est pas encore vérifié.');
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password)];
                        case 2:
                            isPasswordValid = _b.sent();
                            // If password does not match, throw an error
                            if (!isPasswordValid) {
                                throw new common_1.UnauthorizedException('Invalid password !');
                            }
                            return [4 /*yield*/, this.generateTokens({
                                    userId: user.id,
                                })];
                        case 3:
                            _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    user: user,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.register = function (userData) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, hashedPassword, newUser, code;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: userData === null || userData === void 0 ? void 0 : userData.email },
                            })];
                        case 1:
                            existingUser = _c.sent();
                            if (existingUser) {
                                throw new common_1.HttpException("User with email ".concat(userData === null || userData === void 0 ? void 0 : userData.email, " already exists !"), 400);
                            }
                            return [4 /*yield*/, bcrypt.hash(userData === null || userData === void 0 ? void 0 : userData.password, 10)];
                        case 2:
                            hashedPassword = _c.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: __assign(__assign({}, userData), { password: hashedPassword, roleId: [(_a = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.user) === null || _a === void 0 ? void 0 : _a.id, (_b = enum_1.USERROLES === null || enum_1.USERROLES === void 0 ? void 0 : enum_1.USERROLES.transporter) === null || _b === void 0 ? void 0 : _b.id].includes(userData === null || userData === void 0 ? void 0 : userData.roleId)
                                            ? userData.roleId
                                            : 3, verified: false, disponibility: {
                                            create: userData === null || userData === void 0 ? void 0 : userData.disponibility,
                                        } }),
                                    include: {
                                        disponibility: true,
                                    },
                                })];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyEmail = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var user, record, allCodes, tokens, safeUser;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Reçu:', body.email, body.code);
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { email: body.email.toLowerCase() }
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('Utilisateur non trouvé');
                            }
                            console.log('User trouvé ID:', user.id);
                            return [4 /*yield*/, this.prisma.emailVerificationCode.findFirst({
                                    where: {
                                        userId: user.id,
                                        code: body.code,
                                        used: false,
                                        expiresAt: { gt: new Date() },
                                    },
                                })];
                        case 2:
                            record = _a.sent();
                            console.log('Cherche:', { userId: user.id, code: body.code, used: false });
                            return [4 /*yield*/, this.prisma.emailVerificationCode.findMany({ where: { userId: user.id } })];
                        case 3:
                            allCodes = _a.sent();
                            console.log('Tous codes user:', allCodes);
                            if (!record) {
                                console.log('Pas de record trouvé');
                                throw new common_1.UnauthorizedException('Code invalide ou expiré');
                            }
                            // 3. Transaction
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.emailVerificationCode.update({
                                                    where: { id: record.id },
                                                    data: { used: true }
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, tx.user.update({
                                                        where: { id: user.id },
                                                        data: { verified: true }
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 4:
                            // 3. Transaction
                            _a.sent();
                            return [4 /*yield*/, this.generateTokens({ userId: user.id })];
                        case 5:
                            tokens = _a.sent();
                            safeUser = __assign(__assign({}, user), { password: undefined });
                            delete safeUser.password;
                            return [2 /*return*/, {
                                    accessToken: tokens.accessToken,
                                    refreshToken: tokens.refreshToken,
                                    user: safeUser
                                }];
                    }
                });
            });
        };
        // ← refreshToken continue normalement ici
        AuthService_1.prototype.refreshToken = function (refreshTok) {
            return __awaiter(this, void 0, void 0, function () {
                var decoded, payload, tokens, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.jwtService.verifyAsync(refreshTok, {
                                    secret: process.env.JWT_REFRESH_SECRET,
                                })];
                        case 1:
                            decoded = _a.sent();
                            payload = { userId: decoded.userId };
                            return [4 /*yield*/, this.generateTokens(payload)];
                        case 2:
                            tokens = _a.sent();
                            return [2 /*return*/, tokens];
                        case 3:
                            error_1 = _a.sent();
                            throw new common_1.UnauthorizedException('Invalid refresh token');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.requestPasswordReset = function (email) {
                    return __awaiter(this, void 0, void 0, function () {
                        var user, resetPasswordToken, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email } })];
                                case 1:
                                    user = _a.sent();
                                    if (!user) {
                                        throw new common_1.NotFoundException('User not found !');
                                    }
                                    return [4 /*yield*/, this.jwtService.sign({ userId: user === null || user === void 0 ? void 0 : user.id }, {
                                            secret: process.env.JWT_REFRESH_SECRET,
                                            expiresIn: process.env.JWT_REFRESH_EXP_IN,
                                        })];
                                case 2:
                                    resetPasswordToken = _a.sent();
                                    return [4 /*yield*/, this.prisma.user.update({
                                            where: { id: user.id },
                                            data: { resetPasswordToken: resetPasswordToken },
                                        })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            success: true,
                                            resetPasswordToken: resetPasswordToken,
                                        }];
                                case 4:
                                    error_2 = _a.sent();
                                    return [2 /*return*/, false];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
        AuthService_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var newPassword, resetPasswordToken, decoded, user, hashedPassword, verifyError_1, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            newPassword = dto.newPassword, resetPasswordToken = dto.resetPasswordToken;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            decoded = this.jwtService.verify(resetPasswordToken, {
                                secret: process.env.JWT_REFRESH_SECRET,
                            });
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: decoded === null || decoded === void 0 ? void 0 : decoded.userId, resetPasswordToken: resetPasswordToken },
                                })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found or invalid token !');
                            }
                            return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                        case 3:
                            hashedPassword = _a.sent();
                            // Update the user's password and reset token
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { password: hashedPassword, resetPasswordToken: null },
                                })];
                        case 4:
                            // Update the user's password and reset token
                            _a.sent();
                            return [2 /*return*/, true];
                        case 5:
                            verifyError_1 = _a.sent();
                            // Handle token verification errors
                            if (verifyError_1.name === 'TokenExpiredError') {
                                throw new common_1.UnauthorizedException('Reset password token has expired !');
                            }
                            else {
                                throw verifyError_1;
                            }
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_3 = _a.sent();
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.createTransporterByAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, hashedPassword, transporter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Vérifie email existant
                            console.log('DTO reçu:', dto); // 🔍 Debug
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { email: dto.email }
                                })];
                        case 1:
                            existingUser = _a.sent();
                            if (!dto.email) {
                                throw new common_1.HttpException('Email requis', 400);
                            }
                            if (existingUser) {
                                throw new common_1.HttpException('Email déjà utilisé', 400);
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.password, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        firstName: dto.firstName || '',
                                        lastName: dto.lastName || '',
                                        email: dto.email.toLowerCase().trim(),
                                        password: hashedPassword,
                                        roleId: enum_1.USERROLES.transporter.id,
                                        verified: true, // ✅ Auto-vérifié
                                        vehicleNumber: dto.vehicleNumber || '',
                                        vehicleSize: dto.vehicleSize || 'medium',
                                        maxWeightKg: dto.maxWeightKg || 0,
                                    }
                                })];
                        case 3:
                            transporter = _a.sent();
                            delete transporter.password;
                            return [2 /*return*/, transporter];
                    }
                });
            });
        };
        AuthService_1.prototype.getAuthUser = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var decoded, user, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.jwtService.verifyAsync(token, {
                                    secret: process.env.JWT_SECRET,
                                })];
                        case 1:
                            decoded = _a.sent();
                            if (!decoded) {
                                throw new common_1.NotFoundException('Invalid token!');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: decoded === null || decoded === void 0 ? void 0 : decoded.userId },
                                    include: {
                                        disponibility: true,
                                    },
                                })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found or invalid token !');
                            }
                            user === null || user === void 0 ? true : delete user.password;
                            return [2 /*return*/, { accessToken: token, user: user }];
                        case 3:
                            error_4 = _a.sent();
                            throw new common_1.NotFoundException('Invalid token!');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
