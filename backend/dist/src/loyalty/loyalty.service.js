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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let LoyaltyService = class LoyaltyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        return this.prisma.loyaltySettings.findUniqueOrThrow({
            where: { id: 'default' },
        });
    }
    async getBalance(userId) {
        const last = await this.prisma.loyaltyTransaction.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return last?.balanceAfter ?? 0;
    }
    discountFromPoints(points, redeemPointsPerUnit) {
        if (points <= 0)
            return new client_1.Prisma.Decimal(0);
        const per = Number(redeemPointsPerUnit);
        if (per <= 0)
            return new client_1.Prisma.Decimal(0);
        return new client_1.Prisma.Decimal(points / per);
    }
    async validateRedeem(userId, points) {
        const settings = await this.getSettings();
        const balance = await this.getBalance(userId);
        if (points < 0)
            throw new common_1.BadRequestException('نقاط غير صالحة');
        if (points === 0)
            return { balance, settings };
        if (balance < points)
            throw new common_1.BadRequestException('رصيد النقاط غير كافٍ');
        if (points < Number(settings.minRedeemPoints)) {
            throw new common_1.BadRequestException(`الحد الأدنى لاستبدال النقاط هو ${settings.minRedeemPoints}`);
        }
        return { balance, settings };
    }
    async grantEarnForOrder(tx, userId, orderId, orderTotal, description) {
        const dup = await tx.loyaltyTransaction.findFirst({
            where: { orderId, type: client_1.LoyaltyType.EARN },
        });
        if (dup)
            return;
        const settings = await tx.loyaltySettings.findUniqueOrThrow({
            where: { id: 'default' },
        });
        const rate = Number(settings.pointsPerCurrencyUnit);
        const pts = Math.max(0, Math.floor(Number(orderTotal) * rate));
        if (pts === 0)
            return;
        const prev = await this.balanceAfter(tx, userId);
        const balanceAfter = prev + pts;
        await tx.loyaltyTransaction.create({
            data: {
                userId,
                type: client_1.LoyaltyType.EARN,
                points: pts,
                balanceAfter,
                description,
                orderId,
            },
        });
    }
    async balanceAfter(tx, userId) {
        const last = await tx.loyaltyTransaction.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return last?.balanceAfter ?? 0;
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map