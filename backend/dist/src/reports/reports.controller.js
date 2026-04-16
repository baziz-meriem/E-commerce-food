"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let ReportsController = class ReportsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary(user, branchId, from, to) {
        const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);
        const toDate = to ? new Date(to) : new Date();
        const orderFilter = {
            createdAt: { gte: fromDate, lte: toDate },
        };
        if (user.role === client_1.Role.BRANCH_MANAGER) {
            if (!user.branchId) {
                return {
                    range: { from: fromDate, to: toDate },
                    orderCount: 0,
                    revenue: 0,
                    byStatus: [],
                    topProducts: [],
                };
            }
            orderFilter.branchId = user.branchId;
        }
        else if (branchId) {
            orderFilter.branchId = branchId;
        }
        const orders = await this.prisma.order.findMany({
            where: orderFilter,
            select: { total: true, status: true },
        });
        let revenue = 0;
        for (const o of orders) {
            revenue += Number(o.total);
        }
        const statusMap = new Map();
        for (const o of orders) {
            statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
        }
        const byStatus = [...statusMap.entries()].map(([status, count]) => ({
            status,
            count,
        }));
        const topProducts = await this.prisma.orderItem.groupBy({
            by: ['productId', 'nameSnapshot'],
            where: { order: orderFilter },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 10,
        });
        return {
            range: { from: fromDate, to: toDate },
            orderCount: orders.length,
            revenue,
            byStatus,
            topProducts: topProducts.map((r) => ({
                name: r.nameSnapshot,
                productId: r.productId,
                quantity: r._sum.quantity ?? 0,
            })),
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('branchId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "summary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.BRANCH_MANAGER),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map