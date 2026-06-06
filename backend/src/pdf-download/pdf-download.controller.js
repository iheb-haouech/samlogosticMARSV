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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfDownloadController = void 0;
// backend/src/pdf-download/pdf-download.controller.ts
var common_1 = require("@nestjs/common");
var path = require("path");
var fs = require("fs");
var PdfDownloadController = function () {
    var _classDecorators = [(0, common_1.Controller)('downloads')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _downloadPdf_decorators;
    var _viewPdf_decorators;
    var PdfDownloadController = _classThis = /** @class */ (function () {
        function PdfDownloadController_1() {
            this.pdfPath = (__runInitializers(this, _instanceExtraInitializers), path.join(__dirname, '../../generated-pdfs'));
        }
        PdfDownloadController_1.prototype.downloadPdf = function (filename, res) {
            // Sécurité: vérifier que le nom de fichier est valide (PDF uniquement)
            var pdfRegex = /^[a-zA-Z0-9_-]+\.pdf$/;
            if (!pdfRegex.test(filename)) {
                throw new common_1.HttpException('Nom de fichier invalide', 400);
            }
            var filepath = path.join(this.pdfPath, filename);
            // Vérifier si le fichier existe
            if (!fs.existsSync(filepath)) {
                throw new common_1.HttpException('Fichier introuvable', 404);
            }
            // Envoyer le fichier
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
            var fileStream = fs.createReadStream(filepath);
            fileStream.pipe(res);
        };
        PdfDownloadController_1.prototype.viewPdf = function (filename, res) {
            // Pour visualiser le PDF dans le navigateur
            var pdfRegex = /^[a-zA-Z0-9_-]+\.pdf$/;
            if (!pdfRegex.test(filename)) {
                throw new common_1.HttpException('Nom de fichier invalide', 400);
            }
            var filepath = path.join(this.pdfPath, filename);
            if (!fs.existsSync(filepath)) {
                throw new common_1.HttpException('Fichier introuvable', 404);
            }
            // Afficher dans le navigateur au lieu de télécharger
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', "inline; filename=\"".concat(filename, "\""));
            var fileStream = fs.createReadStream(filepath);
            fileStream.pipe(res);
        };
        return PdfDownloadController_1;
    }());
    __setFunctionName(_classThis, "PdfDownloadController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _downloadPdf_decorators = [(0, common_1.Get)(':filename')];
        _viewPdf_decorators = [(0, common_1.Get)('view/:filename')];
        __esDecorate(_classThis, null, _downloadPdf_decorators, { kind: "method", name: "downloadPdf", static: false, private: false, access: { has: function (obj) { return "downloadPdf" in obj; }, get: function (obj) { return obj.downloadPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _viewPdf_decorators, { kind: "method", name: "viewPdf", static: false, private: false, access: { has: function (obj) { return "viewPdf" in obj; }, get: function (obj) { return obj.viewPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PdfDownloadController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PdfDownloadController = _classThis;
}();
exports.PdfDownloadController = PdfDownloadController;
