"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Api = exports.HttpClient = exports.ContentType = void 0;
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType || (exports.ContentType = ContentType = {}));
var HttpClient = /** @class */ (function () {
    function HttpClient(apiConfig) {
        var _a;
        if (apiConfig === void 0) { apiConfig = {}; }
        var _this = this;
        this.baseUrl = '';
        this.securityData = null;
        this.abortControllers = new Map();
        this.customFetch = function () {
            var fetchParams = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fetchParams[_i] = arguments[_i];
            }
            return fetch.apply(void 0, fetchParams);
        };
        this.baseApiParams = {
            credentials: 'same-origin',
            headers: {},
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        };
        this.setSecurityData = function (data) {
            _this.securityData = data;
        };
        this.contentFormatters = (_a = {},
            _a[ContentType.Json] = function (input) {
                return input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input;
            },
            _a[ContentType.Text] = function (input) { return (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input); },
            _a[ContentType.FormData] = function (input) {
                return Object.keys(input || {}).reduce(function (formData, key) {
                    var property = input[key];
                    formData.append(key, property instanceof Blob
                        ? property
                        : typeof property === 'object' && property !== null
                            ? JSON.stringify(property)
                            : "".concat(property));
                    return formData;
                }, new FormData());
            },
            _a[ContentType.UrlEncoded] = function (input) { return _this.toQueryString(input); },
            _a);
        this.createAbortSignal = function (cancelToken) {
            if (_this.abortControllers.has(cancelToken)) {
                var abortController_1 = _this.abortControllers.get(cancelToken);
                if (abortController_1) {
                    return abortController_1.signal;
                }
                return void 0;
            }
            var abortController = new AbortController();
            _this.abortControllers.set(cancelToken, abortController);
            return abortController.signal;
        };
        this.abortRequest = function (cancelToken) {
            var abortController = _this.abortControllers.get(cancelToken);
            if (abortController) {
                abortController.abort();
                _this.abortControllers.delete(cancelToken);
            }
        };
        this.request = function (_a) { return __awaiter(_this, void 0, void 0, function () {
            var secureParams, _b, requestParams, queryString, payloadFormatter, responseFormat;
            var _this = this;
            var body = _a.body, secure = _a.secure, path = _a.path, type = _a.type, query = _a.query, format = _a.format, baseUrl = _a.baseUrl, cancelToken = _a.cancelToken, params = __rest(_a, ["body", "secure", "path", "type", "query", "format", "baseUrl", "cancelToken"]);
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
                            this.securityWorker;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.securityWorker(this.securityData)];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        secureParams = (_b) ||
                            {};
                        requestParams = this.mergeRequestParams(params, secureParams);
                        queryString = query && this.toQueryString(query);
                        payloadFormatter = this.contentFormatters[type || ContentType.Json];
                        responseFormat = format || requestParams.format;
                        return [2 /*return*/, this.customFetch("".concat(baseUrl || this.baseUrl || '').concat(path).concat(queryString ? "?".concat(queryString) : ''), __assign(__assign({}, requestParams), { headers: __assign(__assign({}, (requestParams.headers || {})), (type && type !== ContentType.FormData ? { 'Content-Type': type } : {})), signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null, body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body) })).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var r, data, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            r = response;
                                            r.data = null;
                                            r.error = null;
                                            if (!!responseFormat) return [3 /*break*/, 1];
                                            _a = r;
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, response[responseFormat]()
                                                .then(function (data) {
                                                if (r.ok) {
                                                    r.data = data;
                                                }
                                                else {
                                                    r.error = data;
                                                }
                                                return r;
                                            })
                                                .catch(function (e) {
                                                r.error = e;
                                                return r;
                                            })];
                                        case 2:
                                            _a = _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            data = _a;
                                            if (cancelToken) {
                                                this.abortControllers.delete(cancelToken);
                                            }
                                            if (!response.ok)
                                                throw data;
                                            return [2 /*return*/, data];
                                    }
                                });
                            }); })];
                }
            });
        }); };
        Object.assign(this, apiConfig);
    }
    HttpClient.prototype.encodeQueryParam = function (key, value) {
        var encodedKey = encodeURIComponent(key);
        return "".concat(encodedKey, "=").concat(encodeURIComponent(typeof value === 'number' ? value : "".concat(value)));
    };
    HttpClient.prototype.addQueryParam = function (query, key) {
        return this.encodeQueryParam(key, query[key]);
    };
    HttpClient.prototype.addArrayQueryParam = function (query, key) {
        var _this = this;
        var value = query[key];
        return value.map(function (v) { return _this.encodeQueryParam(key, v); }).join('&');
    };
    HttpClient.prototype.toQueryString = function (rawQuery) {
        var _this = this;
        var query = rawQuery || {};
        var keys = Object.keys(query).filter(function (key) { return 'undefined' !== typeof query[key]; });
        return keys
            .map(function (key) { return (Array.isArray(query[key]) ? _this.addArrayQueryParam(query, key) : _this.addQueryParam(query, key)); })
            .join('&');
    };
    HttpClient.prototype.addQueryParams = function (rawQuery) {
        var queryString = this.toQueryString(rawQuery);
        return queryString ? "?".concat(queryString) : '';
    };
    HttpClient.prototype.mergeRequestParams = function (params1, params2) {
        return __assign(__assign(__assign(__assign({}, this.baseApiParams), params1), (params2 || {})), { headers: __assign(__assign(__assign({}, (this.baseApiParams.headers || {})), (params1.headers || {})), ((params2 && params2.headers) || {})) });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
/**
 * @title TUNLOG
 * @version 1.0
 * @contact
 *
 * Tunlog apis
 */
var Api = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * No description
         *
         * @name AppControllerGetHello
         * @request GET:/
         */
        _this.appControllerGetHello = function (params) {
            if (params === void 0) { params = {}; }
            return _this.request(__assign({ path: "/", method: 'GET' }, params));
        };
        _this.upload = {
            /**
             * No description
             *
             * @name AppControllerUploadFile
             * @summary Upload an image
             * @request POST:/upload
             * @secure
             */
            appControllerUploadFile: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/upload", method: 'POST', body: data, secure: true, type: ContentType.FormData, format: 'json' }, params));
            },
        };
        _this.files = {
            /**
             * No description
             *
             * @name AppControllerSeeUploadedFile
             * @summary Visualize uploaded file
             * @request GET:/files/{filepath}
             * @secure
             */
            appControllerSeeUploadedFile: function (filepath, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/files/".concat(filepath), method: 'GET', secure: true }, params));
            },
        };
        _this.companyTypes = {
            /**
             * No description
             *
             * @name AppControllerGetAllCompanyTypes
             * @request GET:/company-types
             */
            appControllerGetAllCompanyTypes: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/company-types", method: 'GET', format: 'json' }, params));
            },
        };
        _this.companyActivities = {
            /**
             * No description
             *
             * @name AppControllerGetAllCompanyActivities
             * @request GET:/company-activities
             */
            appControllerGetAllCompanyActivities: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/company-activities", method: 'GET', format: 'json' }, params));
            },
        };
        _this.carTypes = {
            /**
             * No description
             *
             * @name AppControllerGetAllCarTypes
             * @request GET:/car-types
             */
            appControllerGetAllCarTypes: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/car-types", method: 'GET', format: 'json' }, params));
            },
        };
        _this.orderStatusesList = {
            /**
             * No description
             *
             * @name AppControllerGetOrderStatuses
             * @request GET:/order-statuses-list
             */
            appControllerGetOrderStatuses: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/order-statuses-list", method: 'GET', format: 'json' }, params));
            },
        };
        _this.statistics = {
            /**
             * No description
             *
             * @name AppControllerGetStatistics
             * @request GET:/statistics
             * @secure
             */
            appControllerGetStatistics: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/statistics", method: 'GET', secure: true, format: 'json' }, params));
            },
        };
        _this.article = {
            /**
             * No description
             *
             * @name ArticleControllerCreate
             * @request GET:/article
             */
            articleControllerCreate: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/article", method: 'GET' }, params));
            },
        };
        _this.mail = {
            /**
             * No description
             *
             * @tags mail
             * @name MailControllerCreate
             * @request GET:/mail
             * @secure
             */
            mailControllerCreate: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/mail", method: 'GET', secure: true }, params));
            },
        };
        _this.user = {
            /**
             * No description
             *
             * @tags user
             * @name UserControllerCreate
             * @request POST:/user
             * @secure
             */
            userControllerCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerFindAll
             * @request GET:/user
             * @secure
             */
            userControllerFindAll: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user", method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerFindAllProviders
             * @request GET:/user/all-providers
             * @secure
             */
            userControllerFindAllProviders: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/all-providers", method: 'GET', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerFindOne
             * @request GET:/user/{id}
             * @secure
             */
            userControllerFindOne: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerUpdate
             * @request PATCH:/user/{id}
             * @secure
             */
            userControllerUpdate: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerRemove
             * @request DELETE:/user/{id}
             * @secure
             */
            userControllerRemove: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/".concat(id), method: 'DELETE', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerFindProviderOrders
             * @request GET:/user/provider-orders/{id}
             * @secure
             */
            userControllerFindProviderOrders: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/provider-orders/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerFindUserOrdersInvoices
             * @request POST:/user/user-orders-invoices/{id}
             * @secure
             */
            userControllerFindUserOrdersInvoices: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/user-orders-invoices/".concat(id), method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerVerifieUser
             * @request PATCH:/user/verfieUser/{id}
             * @secure
             */
            userControllerVerifieUser: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/verfieUser/".concat(id), method: 'PATCH', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerUpdateUserDisponibility
             * @request PATCH:/user/user-disponibility/{id}
             * @secure
             */
            userControllerUpdateUserDisponibility: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/user-disponibility/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags user
             * @name UserControllerGetProvidersInvoice
             * @request POST:/user/generate-provider-invoice
             */
            userControllerGetProvidersInvoice: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/user/generate-provider-invoice", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
        };
        _this.auth = {
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerLogin
             * @request POST:/auth/login
             */
            authControllerLogin: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/login", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerRegister
             * @request POST:/auth/register
             */
            authControllerRegister: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/register", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerRefreshToken
             * @request POST:/auth/refresh-token
             * @secure
             */
            authControllerRefreshToken: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/refresh-token", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerRequestPasswordReset
             * @request POST:/auth/request-reset-password-email
             */
            authControllerRequestPasswordReset: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/request-reset-password-email", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerResetPassword
             * @request POST:/auth/reset-password
             */
            authControllerResetPassword: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/reset-password", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags auth
             * @name AuthControllerGetAuthenticatedUser
             * @request GET:/auth/me
             * @secure
             */
            authControllerGetAuthenticatedUser: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/auth/me", method: 'GET', secure: true, format: 'json' }, params));
            },
        };
        _this.orders = {
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerCreate
             * @request POST:/orders/create-order
             * @secure
             */
            ordersControllerCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/create-order", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerFindAll
             * @request GET:/orders/all-orders
             * @secure
             */
            ordersControllerFindAll: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/all-orders", method: 'GET', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerFindOne
             * @request GET:/orders/order-details/{id}
             * @secure
             */
            ordersControllerFindOne: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/order-details/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerFindOrderStatus
             * @request GET:/orders/order-status-details/{id}
             */
            ordersControllerFindOrderStatus: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/order-status-details/".concat(id), method: 'GET', format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerUpdate
             * @request PATCH:/orders/update-order/{id}
             * @secure
             */
            ordersControllerUpdate: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/update-order/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerUpdateOrderTransporter
             * @request PATCH:/orders/update-order-transporter/{id}
             * @secure
             */
            ordersControllerUpdateOrderTransporter: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/update-order-transporter/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerUpdateStatus
             * @request PATCH:/orders/update-order-status/{id}
             * @secure
             */
            ordersControllerUpdateStatus: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/update-order-status/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders
             * @name OrdersControllerRemove
             * @request DELETE:/orders/delete-order/{id}
             * @secure
             */
            ordersControllerRemove: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/orders/delete-order/".concat(id), method: 'DELETE', secure: true, format: 'json' }, params));
            },
        };
        _this.packages = {
            /**
             * No description
             *
             * @tags orders_packages
             * @name PackagesControllerCreate
             * @request POST:/packages
             * @secure
             */
            packagesControllerCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/packages", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders_packages
             * @name PackagesControllerFindAll
             * @request GET:/packages
             * @secure
             */
            packagesControllerFindAll: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/packages", method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders_packages
             * @name PackagesControllerFindOne
             * @request GET:/packages/{id}
             * @secure
             */
            packagesControllerFindOne: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/packages/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders_packages
             * @name PackagesControllerUpdate
             * @request PATCH:/packages/{id}
             * @secure
             */
            packagesControllerUpdate: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/packages/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags orders_packages
             * @name PackagesControllerRemove
             * @request DELETE:/packages/{id}
             * @secure
             */
            packagesControllerRemove: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/packages/".concat(id), method: 'DELETE', secure: true, format: 'json' }, params));
            },
        };
        _this.transporters = {
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerCreate
             * @request POST:/transporters
             * @secure
             */
            transportersControllerCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters", method: 'POST', body: data, secure: true, type: ContentType.Json }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerFindAll
             * @request GET:/transporters
             * @secure
             */
            transportersControllerFindAll: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters", method: 'GET', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerFindOne
             * @request GET:/transporters/{id}
             * @secure
             */
            transportersControllerFindOne: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerUpdate
             * @request PATCH:/transporters/{id}
             * @secure
             */
            transportersControllerUpdate: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerRemove
             * @request DELETE:/transporters/{id}
             * @secure
             */
            transportersControllerRemove: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/".concat(id), method: 'DELETE', secure: true }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerFindTransporterOrders
             * @request POST:/transporters/transporter-orders/{id}
             * @secure
             */
            transportersControllerFindTransporterOrders: function (id, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/transporter-orders/".concat(id), method: 'POST', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerFindTransporterAcceptedOrders
             * @request POST:/transporters/transporter-accepted-orders/{id}
             * @secure
             */
            transportersControllerFindTransporterAcceptedOrders: function (id, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/transporter-accepted-orders/".concat(id), method: 'POST', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags transporter
             * @name TransportersControllerFindTransporterDeliveredOrders
             * @request GET:/transporters/transporter-delivered-orders/{id}
             * @secure
             */
            transportersControllerFindTransporterDeliveredOrders: function (id, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/transporters/transporter-delivered-orders/".concat(id), method: 'GET', query: query, secure: true, format: 'json' }, params));
            },
        };
        _this.generatePdf = {
            /**
             * No description
             *
             * @tags generate-pdf
             * @name GeneratePdfControllerGetPdf
             * @request GET:/generate-pdf
             */
            generatePdfControllerGetPdf: function (params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/generate-pdf", method: 'GET' }, params));
            },
            /**
             * No description
             *
             * @tags generate-pdf
             * @name GeneratePdfControllerGenerateEtiquette
             * @request POST:/generate-pdf/etiquette-commande
             */
            generatePdfControllerGenerateEtiquette: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/generate-pdf/etiquette-commande", method: 'POST', body: data, type: ContentType.Json, format: 'json' }, params));
            },
        };
        _this.claims = {
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerCreate
             * @request POST:/claims
             * @secure
             */
            claimsControllerCreate: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerFindAll
             * @request GET:/claims
             * @secure
             */
            claimsControllerFindAll: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims", method: 'GET', query: query, secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerAddMessage
             * @request POST:/claims/add-message
             * @secure
             */
            claimsControllerAddMessage: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims/add-message", method: 'POST', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerFindOne
             * @request GET:/claims/{id}
             * @secure
             */
            claimsControllerFindOne: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims/".concat(id), method: 'GET', secure: true, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerUpdate
             * @request PATCH:/claims/{id}
             * @secure
             */
            claimsControllerUpdate: function (id, data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims/".concat(id), method: 'PATCH', body: data, secure: true, type: ContentType.Json, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags claims
             * @name ClaimsControllerRemove
             * @request DELETE:/claims/{id}
             * @secure
             */
            claimsControllerRemove: function (id, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/claims/".concat(id), method: 'DELETE', secure: true, format: 'json' }, params));
            },
        };
        _this.uploadPod = {
            /**
             * No description
             *
             * @tags upload-pod
             * @name UploadPodControllerUploadFile
             * @summary Upload POD
             * @request POST:/upload-pod/upload-pod
             * @secure
             */
            uploadPodControllerUploadFile: function (data, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/upload-pod/upload-pod", method: 'POST', body: data, secure: true, type: ContentType.FormData, format: 'json' }, params));
            },
            /**
             * No description
             *
             * @tags upload-pod
             * @name UploadPodControllerSeeUploadedFile
             * @summary Visualize uploaded file
             * @request GET:/upload-pod/download-pod/files/{filepath}
             */
            uploadPodControllerSeeUploadedFile: function (filepath, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/upload-pod/download-pod/files/".concat(filepath), method: 'GET' }, params));
            },
        };
        return _this;
    }
    return Api;
}(HttpClient));
exports.Api = Api;
