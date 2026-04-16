import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: { include: { branch: true, category: true } } },
    });
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.isActive) throw new NotFoundException('المنتج غير متوفر');
    if (product.stock < quantity)
      throw new BadRequestException('الكمية غير متاحة');
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      const nextQty = existing.quantity + quantity;
      if (product.stock < nextQty)
        throw new BadRequestException('الكمية غير متاحة');
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

  async setQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });
    if (!item || item.userId !== userId) throw new NotFoundException();
    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
      return { removed: true };
    }
    if (item.product.stock < quantity)
      throw new BadRequestException('الكمية غير متاحة');
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { branch: true, category: true } } },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.userId !== userId) throw new NotFoundException();
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { ok: true };
  }
}
