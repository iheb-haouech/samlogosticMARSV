"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderPackagesDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var update_references_dto_1 = require("./update-references.dto");
var UpdateOrderPackagesDTO = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _length_decorators;
    var _length_initializers = [];
    var _width_decorators;
    var _width_initializers = [];
    var _height_decorators;
    var _height_initializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _references_decorators;
    var _references_initializers = [];
    return _a = /** @class */ (function () {
            function UpdateOrderPackagesDTO() {
                this.id = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.weight = __runInitializers(this, _weight_initializers, void 0);
                this.length = __runInitializers(this, _length_initializers, void 0);
                this.width = __runInitializers(this, _width_initializers, void 0);
                this.height = __runInitializers(this, _height_initializers, void 0);
                this.price = __runInitializers(this, _price_initializers, void 0);
                this.quantity = __runInitializers(this, _quantity_initializers, void 0);
                this.references = __runInitializers(this, _references_initializers, void 0);
            }
            return UpdateOrderPackagesDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)()];
            _length_decorators = [(0, swagger_1.ApiProperty)()];
            _width_decorators = [(0, swagger_1.ApiProperty)()];
            _height_decorators = [(0, swagger_1.ApiProperty)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)()];
            _references_decorators = [(0, swagger_1.ApiProperty)({
                    type: function () { return update_references_dto_1.UpdatePackagesReferences; },
                    isArray: true,
                    required: false,
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _length_decorators, { kind: "field", name: "length", static: false, private: false, access: { has: function (obj) { return "length" in obj; }, get: function (obj) { return obj.length; }, set: function (obj, value) { obj.length = value; } }, metadata: _metadata }, _length_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _width_decorators, { kind: "field", name: "width", static: false, private: false, access: { has: function (obj) { return "width" in obj; }, get: function (obj) { return obj.width; }, set: function (obj, value) { obj.width = value; } }, metadata: _metadata }, _width_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: function (obj) { return "height" in obj; }, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; } }, metadata: _metadata }, _height_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _references_decorators, { kind: "field", name: "references", static: false, private: false, access: { has: function (obj) { return "references" in obj; }, get: function (obj) { return obj.references; }, set: function (obj, value) { obj.references = value; } }, metadata: _metadata }, _references_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateOrderPackagesDTO = UpdateOrderPackagesDTO;
