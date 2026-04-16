import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  Prisma,
  Role,
  LoyaltyType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';
import { LoyaltyService } from '../loyalty/loyalty.service';

const DELIVERY_FEE = new Prisma.Decimal(15);

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private loyalty: LoyaltyService,
  ) {}

  async checkout(
    userId: string,
    dto: {
      deliveryAddress: string;
      deliveryPhone: string;
      notes?: string;
      redeemPoints?: number;
    },
  ) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    if (!items.length) throw new BadRequestException('السلة فارغة');
    const branchId = items[0].product.branchId;
    for (const it of items) {
      if (it.product.branchId !== branchId) {
        throw new BadRequestException(
          'يجب أن تكون كل المنتجات من نفس الفرع. أفرغ السلة واختر فرعًا واحدًا.',
        );
      }
      if (!it.product.isActive || it.product.stock < it.quantity) {
        throw new BadRequestException(`المنتج ${it.product.nameAr} غير متاح بالكمية المطلوبة`);
      }
    }

    let subtotal = new Prisma.Decimal(0);
    for (const it of items) {
      subtotal = subtotal.add(
        it.product.price.mul(it.quantity),
      );
    }

    const redeemPoints = dto.redeemPoints ?? 0;
    const { settings } = await this.loyalty.validateRedeem(userId, redeemPoints);
    let loyaltyDiscount = new Prisma.Decimal(0);
    let balanceAfterRedeem = await this.loyalty.getBalance(userId);

    if (redeemPoints > 0) {
      loyaltyDiscount = this.loyalty.discountFromPoints(
        redeemPoints,
        settings.redeemPointsPerUnit,
      );
      const maxDisc = subtotal;
      if (loyaltyDiscount.gt(maxDisc)) {
        loyaltyDiscount = maxDisc;
      }
      balanceAfterRedeem = balanceAfterRedeem - redeemPoints;
    }

    const totalBefore = subtotal.sub(loyaltyDiscount).add(DELIVERY_FEE);
    if (Number(totalBefore) < 0) {
      throw new BadRequestException('قيمة الخصم غير صالحة');
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          branchId,
          status: OrderStatus.PENDING,
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
            type: LoyaltyType.REDEEM,
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

  async listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { branch: true, items: true, driver: { select: { name: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAdmin(user: AuthUser, branchId?: string) {
    const where: Prisma.OrderWhereInput = {};
    if (user.role === Role.BRANCH_MANAGER) {
      if (!user.branchId) return [];
      where.branchId = user.branchId;
    } else if (branchId) {
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

  async getOne(user: AuthUser, id: string) {
    const o = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        branch: true,
        user: { select: { name: true, email: true, phone: true } },
        driver: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!o) throw new NotFoundException();
    if (user.role === Role.CUSTOMER && o.userId !== user.id) {
      throw new ForbiddenException();
    }
    if (user.role === Role.DRIVER && o.driverId !== user.id) {
      throw new ForbiddenException();
    }
    if (user.role === Role.BRANCH_MANAGER && o.branchId !== user.branchId) {
      throw new ForbiddenException();
    }
    return o;
  }

  async updateStatus(
    user: AuthUser,
    id: string,
    status: OrderStatus,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException();
    this.assertCanManageOrder(user, order);

    if (user.role === Role.DRIVER) {
      if (order.driverId !== user.id) throw new ForbiddenException();
      if (status !== OrderStatus.DELIVERED) {
        throw new BadRequestException('السائق يمكنه تأكيد التسليم فقط');
      }
      if (order.status !== OrderStatus.OUT_FOR_DELIVERY) {
        throw new BadRequestException('الطلب ليس في حالة «خارج للتسليم»');
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const o = await tx.order.update({
        where: { id },
        data: { status },
      });

      if (status === OrderStatus.DELIVERED) {
        const existing = await tx.loyaltyTransaction.findFirst({
          where: { orderId: id, type: LoyaltyType.EARN },
        });
        if (!existing) {
          await this.loyalty.grantEarnForOrder(
            tx,
            o.userId,
            o.id,
            o.total,
            `نقاط ومكافأة شراء — ${o.orderNumber}`,
          );
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

  async assignDriver(
    user: AuthUser,
    orderId: string,
    driverId: string,
  ) {
    if (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN && user.role !== Role.BRANCH_MANAGER) {
      throw new ForbiddenException();
    }
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException();
    if (user.role === Role.BRANCH_MANAGER && order.branchId !== user.branchId) {
      throw new ForbiddenException();
    }
    const driver = await this.prisma.user.findUnique({
      where: { id: driverId },
    });
    if (!driver || driver.role !== Role.DRIVER || !driver.isActive) {
      throw new BadRequestException('سائق غير صالح');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { driverId, status: OrderStatus.OUT_FOR_DELIVERY },
      include: {
        branch: true,
        driver: { select: { name: true, phone: true } },
        items: true,
      },
    });
  }

  async listForDriver(userId: string) {
    return this.prisma.order.findMany({
      where: {
        driverId: userId,
        status: {
          in: [OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY],
        },
      },
      include: { branch: true, items: true, user: { select: { name: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  private assertCanManageOrder(
    user: AuthUser,
    order: { branchId: string; userId: string },
  ) {
    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) return;
    if (user.role === Role.BRANCH_MANAGER && user.branchId === order.branchId)
      return;
    if (user.role === Role.DRIVER) return;
    if (user.role === Role.CUSTOMER && user.id === order.userId) return;
    throw new ForbiddenException();
  }
}
