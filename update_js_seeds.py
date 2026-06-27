import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '212.227.76.200'
USER = 'root'
PASS = 'we62pLUjAYqb5'

ORDER_STATUSES_JS = """"use strict";
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
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return g; }), verb(0);
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
                default: if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop(); _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.InitOrderStatuses = void 0;
var InitOrderStatuses = function (prismaClient) { return __awaiter(void 0, void 0, void 0, function () {
    function _a() { return { value: _a[0], done: true }; }
    switch (_a.label = 0) {
        case 0: return [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 1 }, update: {}, create: { id: 1, statusName: 'Créé' } })];
        case 1: return _a.sent(), [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 2 }, update: {}, create: { id: 2, statusName: 'En attente' } })];
        case 2: return _a.sent(), [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 3 }, update: {}, create: { id: 3, statusName: 'En livraison' } })];
        case 3: return _a.sent(), [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 4 }, update: {}, create: { id: 4, statusName: 'Livré' } })];
        case 4: return _a.sent(), [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 5 }, update: {}, create: { id: 5, statusName: 'Annulé' } })];
        case 5: return _a.sent(), [4 /*yield*/, prismaClient.order_status.upsert({ where: { id: 6 }, update: {}, create: { id: 6, statusName: 'Retourné' } })];
        case 6: return [2 /*return*/];
    }
}); };
exports.InitOrderStatuses = InitOrderStatuses;
"""

ORDER_PRICES_JS = """"use strict";
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
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return g; }), verb(0);
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
                default: if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop(); _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.IniOrderPricesStatuses = void 0;
var IniOrderPricesStatuses = function (prismaClient) { return __awaiter(void 0, void 0, void 0, function () {
    function _a() { return { value: _a[0], done: true }; }
    switch (_a.label = 0) {
        case 0: return [4 /*yield*/, prismaClient.order_prices_status.upsert({ where: { id: 1 }, update: {}, create: { id: 1, statusName: 'Aucune action' } })];
        case 1: return _a.sent(), [4 /*yield*/, prismaClient.order_prices_status.upsert({ where: { id: 2 }, update: {}, create: { id: 2, statusName: 'En attente' } })];
        case 2: return _a.sent(), [4 /*yield*/, prismaClient.order_prices_status.upsert({ where: { id: 3 }, update: {}, create: { id: 3, statusName: 'Confirmé' } })];
        case 3: return _a.sent(), [4 /*yield*/, prismaClient.order_prices_status.upsert({ where: { id: 4 }, update: {}, create: { id: 4, statusName: 'Refusé' } })];
        case 4: return [2 /*return*/];
    }
}); };
exports.IniOrderPricesStatuses = IniOrderPricesStatuses;
"""

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=30)

sftp = ssh.open_sftp()
with sftp.open('/var/www/samlogistic/app/backend/prisma/seeds/order-statuses.seed.js', 'w') as f:
    f.write(ORDER_STATUSES_JS)
with sftp.open('/var/www/samlogistic/app/backend/prisma/seeds/order-prices-status.seed.js', 'w') as f:
    f.write(ORDER_PRICES_JS)
sftp.close()

# Verify
for path in [
    '/var/www/samlogistic/app/backend/prisma/seeds/order-statuses.seed.js',
    '/var/www/samlogistic/app/backend/prisma/seeds/order-prices-status.seed.js'
]:
    stdin, stdout, stderr = ssh.exec_command(f'grep -c Livré {path} || echo NO_FR; grep -c Confirmé {path} || echo NO_FR')
    out = stdout.read().decode('utf-8', errors='replace').strip()
    print(f'\n{path}:')
    print(out)

ssh.close()
