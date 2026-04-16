import { BadRequestException, Injectable } from '@nestjs/common';
import { LoyaltyType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.loyaltySettings.findUniqueOrThrow({
      where: { id: 'default' },
    });
  }

  async getBalance(userId: string): Promise<number> {
    const last = await this.prisma.loyaltyTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return last?.balanceAfter ?? 0;
  }

  /** Discount in currency from redeeming `points` (whole points). */
  discountFromPoints(points: number, redeemPointsPerUnit: Prisma.Decimal) {
    if (points <= 0) return new Prisma.Decimal(0);
    const per = Number(redeemPointsPerUnit);
    if (per <= 0) return new Prisma.Decimal(0);
    return new Prisma.Decimal(points / per);
  }

  async validateRedeem(userId: string, points: number) {
    const settings = await this.getSettings();
    const balance = await this.getBalance(userId);
    if (points < 0) throw new BadRequestException('نقاط غير صالحة');
    if (points === 0) return { balance, settings };
    if (balance < points)
      throw new BadRequestException('رصيد النقاط غير كافٍ');
    if (points < Number(settings.minRedeemPoints)) {
      throw new BadRequestException(
        `الحد الأدنى لاستبدال النقاط هو ${settings.minRedeemPoints}`,
      );
    }
    return { balance, settings };
  }

  async grantEarnForOrder(
    tx: Prisma.TransactionClient,
    userId: string,
    orderId: string,
    orderTotal: Prisma.Decimal,
    description: string,
  ) {
    const dup = await tx.loyaltyTransaction.findFirst({
      where: { orderId, type: LoyaltyType.EARN },
    });
    if (dup) return;

    const settings = await tx.loyaltySettings.findUniqueOrThrow({
      where: { id: 'default' },
    });
    const rate = Number(settings.pointsPerCurrencyUnit);
    const pts = Math.max(0, Math.floor(Number(orderTotal) * rate));
    if (pts === 0) return;
    const prev = await this.balanceAfter(tx, userId);
    const balanceAfter = prev + pts;
    await tx.loyaltyTransaction.create({
      data: {
        userId,
        type: LoyaltyType.EARN,
        points: pts,
        balanceAfter,
        description,
        orderId,
      },
    });
  }

  private async balanceAfter(tx: Prisma.TransactionClient, userId: string) {
    const last = await tx.loyaltyTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return last?.balanceAfter ?? 0;
  }
}
