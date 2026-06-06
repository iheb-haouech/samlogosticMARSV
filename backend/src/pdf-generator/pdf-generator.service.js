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
exports.PdfGeneratorService = void 0;
// backend/src/pdf-generator/pdf-generator.service.ts
var common_1 = require("@nestjs/common");
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var pdf = require("html-pdf");
var puppeteer = require("puppeteer"); // ✅ AJOUTER
var PdfGeneratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PdfGeneratorService = _classThis = /** @class */ (function () {
        function PdfGeneratorService_1(prisma) {
            this.prisma = prisma;
            // ✅ AJOUTER ces 2 propriétés
            this.templatesPath = path.join(__dirname, '../../templates');
            this.outputPath = path.join(__dirname, '../../generated-pdfs');
        }
        PdfGeneratorService_1.prototype.generatePdf = function (data, templateName, savedFileName, save) {
            if (save === void 0) { save = false; }
            return __awaiter(this, void 0, void 0, function () {
                var htmlPath, html, template, compiledHtml_1, pdfBuffer, filePath, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            htmlPath = path.join(__dirname, '../../templates', templateName);
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
                            // Sauvegarder si nécessaire
                            if (save) {
                                filePath = path.join(__dirname, '../../generated-pdfs', savedFileName);
                                fs.writeFileSync(filePath, pdfBuffer); // ✅ Cast en any
                            }
                            return [2 /*return*/, pdfBuffer];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error generating PDF:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PdfGeneratorService_1.prototype.generateShippingLabel = function (labelData) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var templatePath, templateContent, template, htmlContent, filename, filepath;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            templatePath = path.join(this.templatesPath, 'label.hbs');
                            if (!fs.existsSync(templatePath)) {
                                throw new Error("Template introuvable: ".concat(templatePath));
                            }
                            templateContent = fs.readFileSync(templatePath, 'utf8');
                            template = handlebars.compile(templateContent);
                            htmlContent = template({
                                companyName: 'SAM LOGISTIC',
                                companyWebsite: 'samlogistic.tn',
                                trackingId: labelData.trackingId,
                                recipientName: labelData.recipient.companyName || 'N/A',
                                recipientAddress: labelData.recipient.streetAddress || '',
                                recipientCity: labelData.recipient.city || '',
                                recipientZipCode: labelData.recipient.zipCode || '',
                                recipientCountry: labelData.recipient.country || 'Tunisie',
                                recipientPhone: labelData.recipient.phone || '',
                                senderName: labelData.sender.companyName || 'N/A',
                                senderAddress: labelData.sender.streetAddress || '',
                                senderCity: labelData.sender.city || '',
                                senderZipCode: labelData.sender.zipCode || '',
                                totalWeight: labelData.totalWeight || 0,
                                packageCount: ((_a = labelData.packages) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                shippingDate: new Date(labelData.shippingDate).toLocaleDateString('fr-FR'),
                                serviceType: 'Standard',
                            });
                            filename = "label-".concat(labelData.trackingId, "-").concat(Date.now(), ".pdf");
                            return [4 /*yield*/, this.htmlToPdf(htmlContent, filename)];
                        case 1:
                            filepath = _b.sent();
                            return [2 /*return*/, { path: filepath, filename: filename }];
                    }
                });
            });
        };
        PdfGeneratorService_1.prototype.htmlToPdf = function (htmlContent, filename) {
            return __awaiter(this, void 0, void 0, function () {
                var browser, page, pdfPath, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, 6, 9]);
                            return [4 /*yield*/, puppeteer.launch({
                                    headless: true,
                                    args: [
                                        '--no-sandbox',
                                        '--disable-setuid-sandbox',
                                        '--disable-dev-shm-usage',
                                    ],
                                })];
                        case 1:
                            browser = _a.sent();
                            return [4 /*yield*/, browser.newPage()];
                        case 2:
                            page = _a.sent();
                            return [4 /*yield*/, page.setContent(htmlContent, {
                                    waitUntil: 'networkidle0',
                                    timeout: 30000,
                                })];
                        case 3:
                            _a.sent();
                            pdfPath = path.join(this.outputPath, filename);
                            return [4 /*yield*/, page.pdf({
                                    path: pdfPath,
                                    format: 'A4',
                                    printBackground: true,
                                    margin: {
                                        top: '20px',
                                        right: '20px',
                                        bottom: '20px',
                                        left: '20px',
                                    },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, pdfPath];
                        case 5:
                            error_2 = _a.sent();
                            console.error('Erreur génération PDF:', error_2);
                            throw error_2;
                        case 6:
                            if (!browser) return [3 /*break*/, 8];
                            return [4 /*yield*/, browser.close()];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        PdfGeneratorService_1.prototype.generateInvoice = function (orderId, res) {
            return __awaiter(this, void 0, void 0, function () {
                var order, templateName, savedFileName, pdfBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                                where: { id: orderId },
                                include: {
                                    source: true,
                                    recipient: true,
                                    packages: {
                                        include: {
                                            references: true,
                                        },
                                    },
                                    deliveredBy: true,
                                },
                            })];
                        case 1:
                            order = _a.sent();
                            templateName = 'invoice.hbs';
                            savedFileName = "invoice-".concat(order.trackingId, ".pdf");
                            return [4 /*yield*/, this.generatePdf(__assign(__assign({}, order), { createdAt: "".concat(order.createdAt.getDate(), "/").concat(order.createdAt.getMonth() + 1, "/").concat(order.createdAt.getFullYear()) }), templateName, savedFileName, true)];
                        case 2:
                            pdfBuffer = _a.sent();
                            res.setHeader('Content-Type', 'application/pdf');
                            res.send(pdfBuffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfGeneratorService_1.prototype.generateLabel = function (orderId, res) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __awaiter(this, void 0, void 0, function () {
                var order, templateName, savedFileName, pdfBuffer;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, this.prisma.order.findUnique({
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
                            order = _k.sent();
                            templateName = 'etiquette-commande.hbs';
                            savedFileName = "label-".concat(order.trackingId, ".pdf");
                            return [4 /*yield*/, this.generatePdf(__assign(__assign({}, order), { references: order === null || order === void 0 ? void 0 : order.refrences, createdAt: "".concat((_a = order === null || order === void 0 ? void 0 : order.createdAt) === null || _a === void 0 ? void 0 : _a.getDate(), "/").concat((_b = order === null || order === void 0 ? void 0 : order.createdAt) === null || _b === void 0 ? void 0 : _b.getMonth(), "/").concat((_c = order === null || order === void 0 ? void 0 : order.createdAt) === null || _c === void 0 ? void 0 : _c.getFullYear()), startTransitAt: (order === null || order === void 0 ? void 0 : order.startTransitAt)
                                        ? "".concat(order.startTransitAt.getDate(), "/").concat(order.startTransitAt.getMonth(), "/").concat(order.startTransitAt.getFullYear())
                                        : null, packagesLength: (_d = order === null || order === void 0 ? void 0 : order.packages) === null || _d === void 0 ? void 0 : _d.length, packages: (_e = order === null || order === void 0 ? void 0 : order.packages) === null || _e === void 0 ? void 0 : _e.map(function (pkg) { return (__assign(__assign({}, pkg), { totalPrice: (pkg === null || pkg === void 0 ? void 0 : pkg.quantity) * (pkg === null || pkg === void 0 ? void 0 : pkg.price) })); }), source: __assign(__assign({}, order === null || order === void 0 ? void 0 : order.source), { companyName: (_g = (_f = order === null || order === void 0 ? void 0 : order.source) === null || _f === void 0 ? void 0 : _f.companyName) === null || _g === void 0 ? void 0 : _g.toUpperCase() }), recipient: __assign(__assign({}, order === null || order === void 0 ? void 0 : order.recipient), { companyName: (_j = (_h = order === null || order === void 0 ? void 0 : order.recipient) === null || _h === void 0 ? void 0 : _h.companyName) === null || _j === void 0 ? void 0 : _j.toUpperCase() }) }), templateName, savedFileName, true)];
                        case 2:
                            pdfBuffer = _k.sent();
                            res.setHeader('Content-Type', 'application/pdf');
                            res.send(pdfBuffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return PdfGeneratorService_1;
    }());
    __setFunctionName(_classThis, "PdfGeneratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PdfGeneratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PdfGeneratorService = _classThis;
}();
exports.PdfGeneratorService = PdfGeneratorService;
