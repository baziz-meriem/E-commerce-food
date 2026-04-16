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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const DELIVERY_FEE = new client_1.Prisma.Decimal(15);
let OrdersService = class OrdersService {
    prisma;
    loyalty;
    constructor(prisma, loyalty) {
        this.prisma = prisma;
        this.loyalty = loyalty;
    }
    async checkout(userId, dto) {
        const items = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (!items.length)
            throw new common_1.BadRequestException('السلة فارغة');
        const branchId = items[0].product.branchId;
        for (const it of items) {
            if (it.product.branchId !== branchId) {
                throw new common_1.BadRequestException('يجب أن تكون كل المنتجات من نفس الفرع. أفرغ السلة واختر فرعًا واحدًا.');
            }
            if (!it.product.isActive || it.product.stock < it.quantity) {
                throw new common_1.BadRequestException(`المنتج ${it.product.nameAr} غير متاح بالكمية المطلوبة`);
            }
        }
        let subtotal = new client_1.Prisma.Decimal(0);
        for (const it of items) {
            subtotal = subtotal.add(it.product.price.mul(it.quantity));
        }
        const redeemPoints = dto.redeemPoints ?? 0;
        const { settings } = await this.loyalty.validateRedeem(userId, redeemPoints);
        let loyaltyDiscount = new client_1.Prisma.Decimal(0);
        let balanceAfterRedeem = await this.loyalty.getBalance(userId);
        if (redeemPoints > 0) {
            loyaltyDiscount = this.loyalty.discountFromPoints(redeemPoints, settings.redeemPointsPerUnit);
            const maxDisc = subtotal;
            if (loyaltyDiscount.gt(maxDisc)) {
                loyaltyDiscount = maxDisc;
            }
            balanceAfterRedeem = balanceAfterRedeem - redeemPoints;
        }
        const totalBefore = subtotal.sub(loyaltyDiscount).add(DELIVERY_FEE);
        if (Number(totalBefore) < 0) {
            throw new common_1.BadRequestException('قيمة الخصم غير صالحة');
        }
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    branchId,
                    status: client_1.OrderStatus.PENDING,
                    subtotal,
                    deliveryFee: DELIVERY_FEE,
                    loyaltyDiscount,
                    total: totalBefore,
                    deliveryAddress: dto.deliveryAddress,
                    deliveryPhone: dto.deliveryPhone,
                    notes: dto.notes ?? '',
                    items: {
                        create: items.map((it) => ({
                            productId: it.productId,
                            quantity: it.quantity,
                            unitPrice: it.product.price,
                            nameSnapshot: it.product.nameAr,
                        })),
                    },
                },
            });
            for (const it of items) {
                await tx.product.update({
                    where: { id: it.productId },
                    data: { stock: { decrement: it.quantity } },
                });
            }
            await tx.cartItem.deleteMany({ where: { userId } });
            if (redeemPoints > 0) {
                await tx.loyaltyTransaction.create({
                    data: {
                        userId,
                        type: client_1.LoyaltyType.REDEEM,
                        points: redeemPoints,
                        balanceAfter: balanceAfterRedeem,
                        description: `استبدال عند الطلب ${orderNumber}`,
                        orderId: created.id,
                    },
                });
            }
            return created;
        });
        return this.prisma.order.findUniqueOrThrow({
            where: { id: order.id },
            include: {
                items: true,
                branch: true,
                user: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
    }
    async listForUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { branch: true, items: true, driver: { select: { name: true, phone: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async listAdmin(user, branchId) {
        const where = {};
        if (user.role === client_1.Role.BRANCH_MANAGER) {
            if (!user.branchId)
                return [];
            where.branchId = user.branchId;
        }
        else if (branchId) {
            where.branchId = branchId;
        }
        return this.prisma.order.findMany({
            where,
            include: {
                branch: true,
                user: { select: { name: true, email: true, phone: true } },
                driver: { select: { name: true, phone: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOne(user, id) {
        const o = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                branch: true,
                user: { select: { name: true, email: true, phone: true } },
                driver: { select: { id: true, name: true, phone: true } },
            },
        });
        if (!o)
            throw new common_1.NotFoundException();
        if (user.role === client_1.Role.CUSTOMER && o.userId !== user.id) {
            throw new common_1.ForbiddenException();
        }
        if (user.role === client_1.Role.DRIVER && o.driverId !== user.id) {
            throw new common_1.ForbiddenException();
        }
        if (user.role === client_1.Role.BRANCH_MANAGER && o.branchId !== user.branchId) {
            throw new common_1.ForbiddenException();
        }
        return o;
    }
    async updateStatus(user, id, status) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException();
        this.assertCanManageOrder(user, order);
        if (user.role === client_1.Role.DRIVER) {
            if (order.driverId !== user.id)
                throw new common_1.ForbiddenException();
            if (status !== client_1.OrderStatus.DELIVERED) {
                throw new common_1.BadRequestException('السائق يمكنه تأكيد التسليم فقط');
            }
            if (order.status !== client_1.OrderStatus.OUT_FOR_DELIVERY) {
                throw new common_1.BadRequestException('الطلب ليس في حالة «خارج للتسليم»');
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const o = await tx.order.update({
                where: { id },
                data: { status },
            });
            if (status === client_1.OrderStatus.DELIVERED) {
                const existing = await tx.loyaltyTransaction.findFirst({
                    where: { orderId: id, type: client_1.LoyaltyType.EARN },
                });
                if (!existing) {
                    await this.loyalty.grantEarnForOrder(tx, o.userId, o.id, o.total, `نقاط ومكافأة شراء — ${o.orderNumber}`);
                }
                await tx.order.update({
                    where: { id },
                    data: { codCollected: true },
                });
            }
            return o;
        });
        return this.getOne(user, updated.id);
    }
    async assignDriver(user, orderId, driverId) {
        if (user.role !== client_1.Role.SUPER_ADMIN && user.role !== client_1.Role.ADMIN && user.role !== client_1.Role.BRANCH_MANAGER) {
            throw new common_1.ForbiddenException();
        }
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException();
        if (user.role === client_1.Role.BRANCH_MANAGER && order.branchId !== user.branchId) {
            throw new common_1.ForbiddenException();
        }
        const driver = await this.prisma.user.findUnique({
            where: { id: driverId },
        });
        if (!driver || driver.role !== client_1.Role.DRIVER || !driver.isActive) {
            throw new common_1.BadRequestException('سائق غير صالح');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { driverId, status: client_1.OrderStatus.OUT_FOR_DELIVERY },
            include: {
                branch: true,
                driver: { select: { name: true, phone: true } },
                items: true,
            },
        });
    }
    async listForDriver(userId) {
        return this.prisma.order.findMany({
            where: {
                driverId: userId,
                status: {
                    in: [client_1.OrderStatus.READY, client_1.OrderStatus.OUT_FOR_DELIVERY],
                },
            },
            include: { branch: true, items: true, user: { select: { name: true, phone: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    assertCanManageOrder(user, order) {
        if (user.role === client_1.Role.SUPER_ADMIN || user.role === client_1.Role.ADMIN)
            return;
        if (user.role === client_1.Role.BRANCH_MANAGER && user.branchId === order.branchId)
            return;
        if (user.role === client_1.Role.DRIVER)
            return;
        if (user.role === client_1.Role.CUSTOMER && user.id === order.userId)
            return;
        throw new common_1.ForbiddenException();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        loyalty_service_1.LoyaltyService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map