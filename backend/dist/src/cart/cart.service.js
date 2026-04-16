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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        return this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: { include: { branch: true, category: true } } },
        });
    }
    async addItem(userId, productId, quantity) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || !product.isActive)
            throw new common_1.NotFoundException('المنتج غير متوفر');
        if (product.stock < quantity)
            throw new common_1.BadRequestException('الكمية غير متاحة');
        const existing = await this.prisma.cartItem.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (existing) {
            const nextQty = existing.quantity + quantity;
            if (product.stock < nextQty)
                throw new common_1.BadRequestException('الكمية غير متاحة');
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: nextQty },
                include: { product: { include: { branch: true, category: true } } },
            });
        }
        return this.prisma.cartItem.create({
            data: { userId, productId, quantity },
            include: { product: { include: { branch: true, category: true } } },
        });
    }
    async setQuantity(userId, itemId, quantity) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException();
        if (quantity <= 0) {
            await this.prisma.cartItem.delete({ where: { id: itemId } });
            return { removed: true };
        }
        if (item.product.stock < quantity)
            throw new common_1.BadRequestException('الكمية غير متاحة');
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: { include: { branch: true, category: true } } },
        });
    }
    async removeItem(userId, itemId) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
        });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException();
        await this.prisma.cartItem.delete({ where: { id: itemId } });
        return { ok: true };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map