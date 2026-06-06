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
exports.GeneratePdfService = void 0;
var common_1 = require("@nestjs/common");
var handlebars = require("handlebars");
var pdf = require("html-pdf");
var path = require("path");
var fs = require("fs");
var GeneratePdfService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GeneratePdfService = _classThis = /** @class */ (function () {
        function GeneratePdfService_1(prisma) {
            this.prisma = prisma;
        }
        GeneratePdfService_1.prototype.generatePdf = function (data, template_name, saved_file_name, save) {
            if (save === void 0) { save = false; }
            return __awaiter(this, void 0, void 0, function () {
                var htmlPath, html, template, compiledHtml_1, pdfBuffer, filePath, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
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
                            if (!save) return [3 /*break*/, 3];
                            filePath = path.join(__dirname, '../../../generatedFiles', saved_file_name);
                            return [4 /*yield*/, fs.writeFileSync(filePath, pdfBuffer, { flag: 'w' })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, pdfBuffer];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Error generating PDF:', error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        GeneratePdfService_1.prototype.generateEtiquette = function (orderId, res, save) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (save === void 0) { save = false; }
            return __awaiter(this, void 0, void 0, function () {
                var order, template_name, saved_file_name, pdfBuffer, error_2;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0:
                            _o.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.order.findUnique({
                                    where: { id: orderId },
                                    include: {
                                        source: true,
                                        recipient: true,
                                        packages: {
                                            include: {
                                                references: true,
                                            },
                                        },
                                        deliveredBy: {
                                            include: {
                                                disponibility: true,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            order = _o.sent();
                            template_name = 'etiquette-commande.hbs';
                            saved_file_name = 'output.pdf';
                            return [4 /*yield*/, this.generatePdf(__assign(__assign({}, order), { references: order === null || order === void 0 ? void 0 : order.refrences, createdAt: "".concat((_a = order === null || order === void 0 ? void 0 : order.createdAt) === null || _a === void 0 ? void 0 : _a.getDate(), "/").concat((_b = order === null || order === void 0 ? void 0 : order.createdAt) === null || _b === void 0 ? void 0 : _b.getMonth(), "/").concat((_c = order === null || order === void 0 ? void 0 : order.createdAt) === null || _c === void 0 ? void 0 : _c.getFullYear()), startTransitAt: "".concat((_d = order === null || order === void 0 ? void 0 : order.startTransitAt) === null || _d === void 0 ? void 0 : _d.getDate(), "/").concat((_e = order === null || order === void 0 ? void 0 : order.startTransitAt) === null || _e === void 0 ? void 0 : _e.getMonth(), "/").concat((_f = order === null || order === void 0 ? void 0 : order.startTransitAt) === null || _f === void 0 ? void 0 : _f.getFullYear()), packagesLength: (_g = order === null || order === void 0 ? void 0 : order.packages) === null || _g === void 0 ? void 0 : _g.length, packages: (_h = order === null || order === void 0 ? void 0 : order.packages) === null || _h === void 0 ? void 0 : _h.map(function (pkg) { return (__assign(__assign({}, pkg), { totalPrice: (pkg === null || pkg === void 0 ? void 0 : pkg.quantity) * (pkg === null || pkg === void 0 ? void 0 : pkg.price) })); }), source: __assign(__assign({}, order === null || order === void 0 ? void 0 : order.source), { companyName: (_k = (_j = order === null || order === void 0 ? void 0 : order.source) === null || _j === void 0 ? void 0 : _j.companyName) === null || _k === void 0 ? void 0 : _k.toUpperCase() }), recipient: __assign(__assign({}, order === null || order === void 0 ? void 0 : order.recipient), { companyName: (_m = (_l = order === null || order === void 0 ? void 0 : order.recipient) === null || _l === void 0 ? void 0 : _l.companyName) === null || _m === void 0 ? void 0 : _m.toUpperCase() }) }), template_name, saved_file_name, save)];
                        case 2:
                            pdfBuffer = _o.sent();
                            console.log(order);
                            // Set response headers
                            res.setHeader('Content-Type', 'application/pdf');
                            // Send the PDF buffer as response
                            return [2 /*return*/, res.send(pdfBuffer)];
                        case 3:
                            error_2 = _o.sent();
                            console.log(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return GeneratePdfService_1;
    }());
    __setFunctionName(_classThis, "GeneratePdfService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeneratePdfService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeneratePdfService = _classThis;
}();
exports.GeneratePdfService = GeneratePdfService;
