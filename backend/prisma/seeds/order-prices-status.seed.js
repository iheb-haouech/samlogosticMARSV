"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IniOrderPricesStatuses = void 0;
const IniOrderPricesStatuses = async (prismaClient) => {
    await prismaClient.order_prices_status.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, statusName: 'Aucune action' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, statusName: 'En attente' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, statusName: 'Confirmé' },
    });
    await prismaClient.order_prices_status.upsert({
        where: { id: 4 },
        update: {},
        create: { id: 4, statusName: 'Refusé' },
    });
};
exports.IniOrderPricesStatuses = IniOrderPricesStatuses;
