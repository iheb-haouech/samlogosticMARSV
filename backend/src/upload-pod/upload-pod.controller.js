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
exports.UploadPodController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var multer_1 = require("multer");
var platform_express_1 = require("@nestjs/platform-express");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var upload_pod_dto_1 = require("./dto/upload-pod.dto");
var UPLOADED_FILES_PATH = './uploadedFiles';
var UploadPodController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('upload-pod'), (0, common_1.Controller)('upload-pod')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadFile_decorators;
    var _seeUploadedFile_decorators;
    var UploadPodController = _classThis = /** @class */ (function () {
        function UploadPodController_1(uploadPodService, prisma) {
            this.uploadPodService = (__runInitializers(this, _instanceExtraInitializers), uploadPodService);
            this.prisma = prisma;
        }
        UploadPodController_1.prototype.uploadFile = function (order_id, file, res) {
            return __awaiter(this, void 0, void 0, function () {
                var orderExists, podUrl, existingPod, podRecord, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Received order_id:', order_id);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, this.prisma.order.findUnique({
                                    where: { id: order_id },
                                })];
                        case 2:
                            orderExists = _a.sent();
                            if (!orderExists) {
                                return [2 /*return*/, res.status(404).json({ message: 'Order does not exist' })];
                            }
                            podUrl = "/upload-pod/download-pod/files/".concat(file.filename);
                            return [4 /*yield*/, this.prisma.order_pod.findFirst({
                                    where: { orderId: order_id },
                                })];
                        case 3:
                            existingPod = _a.sent();
                            podRecord = void 0;
                            if (!existingPod) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.order_pod.update({
                                    where: { id: existingPod.id },
                                    data: { podUrl: podUrl },
                                })];
                        case 4:
                            // Update the existing POD record
                            podRecord = _a.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.prisma.order_pod.create({
                                data: {
                                    orderId: order_id,
                                    podUrl: podUrl,
                                },
                            })];
                        case 6:
                            // Create a new POD record
                            podRecord = _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, res.status(200).json({
                                message: 'POD uploaded successfully',
                                podUrl: podUrl,
                                pod: podRecord,
                            })];
                        case 8:
                            error_1 = _a.sent();
                            console.error('Error uploading POD:', error_1);
                            return [2 /*return*/, res
                                    .status(500)
                                    .json({ message: error_1.message || 'An error occurred' })];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        UploadPodController_1.prototype.seeUploadedFile = function (file, res) {
            return res.sendFile(file, { root: UPLOADED_FILES_PATH });
        };
        return UploadPodController_1;
    }());
    __setFunctionName(_classThis, "UploadPodController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadFile_decorators = [(0, common_1.Post)('upload-pod'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({ summary: 'Upload POD' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        order_id: { type: 'string' },
                        file: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'POD uploaded successfully',
                type: upload_pod_dto_1.UploadPodResponseDto, // Use the response DTO here
            }), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
                storage: (0, multer_1.diskStorage)({
                    destination: UPLOADED_FILES_PATH,
                    filename: function (req, file, callback) {
                        var order_id = req.body.order_id;
                        if (!order_id) {
                            return callback(new Error('Order ID is required'), null);
                        }
                        var fileExt = file.originalname.split('.').pop();
                        var newFileName = "POD-".concat(order_id, ".").concat(fileExt);
                        callback(null, newFileName);
                    },
                }),
            }))];
        _seeUploadedFile_decorators = [(0, common_1.Get)('download-pod/files/:filepath'), (0, swagger_1.ApiOperation)({ summary: 'Visualize uploaded file' })];
        __esDecorate(_classThis, null, _uploadFile_decorators, { kind: "method", name: "uploadFile", static: false, private: false, access: { has: function (obj) { return "uploadFile" in obj; }, get: function (obj) { return obj.uploadFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _seeUploadedFile_decorators, { kind: "method", name: "seeUploadedFile", static: false, private: false, access: { has: function (obj) { return "seeUploadedFile" in obj; }, get: function (obj) { return obj.seeUploadedFile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UploadPodController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UploadPodController = _classThis;
}();
exports.UploadPodController = UploadPodController;
