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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_1 = require("multer");
var upload_file_helper_1 = require("./utils/upload-file.helper");
var jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
var response_dto_1 = require("./utils/response.dto");
var UPLOADED_FILES_PATH = './uploadedFiles';
var AppController = function () {
    var _classDecorators = [(0, common_1.Controller)(), (0, swagger_1.ApiOkResponse)({
            description: 'response',
            type: response_dto_1.ResponseDto,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getHello_decorators;
    var _uploadFile_decorators;
    var _seeUploadedFile_decorators;
    var _getAllCompanyTypes_decorators;
    var _getAllCompanyActivities_decorators;
    var _getAllCarTypes_decorators;
    var _getOrderStatuses_decorators;
    var _getStatistics_decorators;
    var AppController = _classThis = /** @class */ (function () {
        function AppController_1(appService) {
            this.appService = (__runInitializers(this, _instanceExtraInitializers), appService);
        }
        AppController_1.prototype.getHello = function () {
            return this.appService.getHello();
        };
        AppController_1.prototype.uploadFile = function (file) {
            console.log(file);
            return { filename: file === null || file === void 0 ? void 0 : file.filename, type: file === null || file === void 0 ? void 0 : file.mimetype };
        };
        AppController_1.prototype.seeUploadedFile = function (file, res) {
            return res.sendFile(file, { root: UPLOADED_FILES_PATH });
        };
        AppController_1.prototype.getAllCompanyTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appService.getAllCompanyTypes()];
                });
            });
        };
        AppController_1.prototype.getAllCompanyActivities = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appService.getAllCompanyActivities()];
                });
            });
        };
        AppController_1.prototype.getAllCarTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appService.getAllCarTypes()];
                });
            });
        };
        AppController_1.prototype.getOrderStatuses = function () {
            return this.appService.getAllOrderStatuses();
        };
        AppController_1.prototype.getStatistics = function (userToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appService.getStatistics(userToken)];
                });
            });
        };
        return AppController_1;
    }());
    __setFunctionName(_classThis, "AppController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getHello_decorators = [(0, common_1.Get)()];
        _uploadFile_decorators = [(0, common_1.Post)('upload'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: 'Upload an image' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: upload_file_helper_1.FileUploadTypeSchema,
            }), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
                storage: (0, multer_1.diskStorage)({
                    destination: UPLOADED_FILES_PATH,
                    filename: upload_file_helper_1.editFileName,
                }),
            }))];
        _seeUploadedFile_decorators = [(0, common_1.Get)('files/:filepath'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: 'Visualize uploaded file' })];
        _getAllCompanyTypes_decorators = [(0, common_1.Get)('/company-types'), (0, swagger_1.ApiOkResponse)({
                description: 'response',
                type: response_dto_1.ResponseDto,
            })];
        _getAllCompanyActivities_decorators = [(0, common_1.Get)('/company-activities'), (0, swagger_1.ApiOkResponse)({
                description: 'response',
                type: response_dto_1.ResponseDto,
            })];
        _getAllCarTypes_decorators = [(0, common_1.Get)('/car-types'), (0, swagger_1.ApiOkResponse)({
                description: 'response',
                type: response_dto_1.ResponseDto,
            })];
        _getOrderStatuses_decorators = [(0, common_1.Get)('/order-statuses-list'), (0, swagger_1.ApiOkResponse)({
                description: 'response',
                type: response_dto_1.ResponseDto,
            })];
        _getStatistics_decorators = [(0, common_1.Get)('/statistics'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOkResponse)({
                description: 'get satistics',
                type: response_dto_1.StatisticsDTO,
            })];
        __esDecorate(_classThis, null, _getHello_decorators, { kind: "method", name: "getHello", static: false, private: false, access: { has: function (obj) { return "getHello" in obj; }, get: function (obj) { return obj.getHello; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadFile_decorators, { kind: "method", name: "uploadFile", static: false, private: false, access: { has: function (obj) { return "uploadFile" in obj; }, get: function (obj) { return obj.uploadFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _seeUploadedFile_decorators, { kind: "method", name: "seeUploadedFile", static: false, private: false, access: { has: function (obj) { return "seeUploadedFile" in obj; }, get: function (obj) { return obj.seeUploadedFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllCompanyTypes_decorators, { kind: "method", name: "getAllCompanyTypes", static: false, private: false, access: { has: function (obj) { return "getAllCompanyTypes" in obj; }, get: function (obj) { return obj.getAllCompanyTypes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllCompanyActivities_decorators, { kind: "method", name: "getAllCompanyActivities", static: false, private: false, access: { has: function (obj) { return "getAllCompanyActivities" in obj; }, get: function (obj) { return obj.getAllCompanyActivities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllCarTypes_decorators, { kind: "method", name: "getAllCarTypes", static: false, private: false, access: { has: function (obj) { return "getAllCarTypes" in obj; }, get: function (obj) { return obj.getAllCarTypes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrderStatuses_decorators, { kind: "method", name: "getOrderStatuses", static: false, private: false, access: { has: function (obj) { return "getOrderStatuses" in obj; }, get: function (obj) { return obj.getOrderStatuses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatistics_decorators, { kind: "method", name: "getStatistics", static: false, private: false, access: { has: function (obj) { return "getStatistics" in obj; }, get: function (obj) { return obj.getStatistics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppController = _classThis;
}();
exports.AppController = AppController;
