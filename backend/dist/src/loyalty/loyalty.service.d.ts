import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class LoyaltyService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        pointsPerCurrencyUnit: Prisma.Decimal;
        redeemPointsPerUnit: Prisma.Decimal;
        minRedeemPoints: number;
    }>;
    getBalance(userId: string): Promise<number>;
    discountFromPoints(points: number, redeemPointsPerUnit: Prisma.Decimal): Prisma.Decimal;
    validateRedeem(userId: string, points: number): Promise<{
        balance: number;
        settings: {
            id: string;
            pointsPerCurrencyUnit: Prisma.Decimal;
            redeemPointsPerUnit: Prisma.Decimal;
            minRedeemPoints: number;
        };
    }>;
    grantEarnForOrder(tx: Prisma.TransactionClient, userId: string, orderId: string, orderTotal: Prisma.Decimal, description: string): Promise<void>;
    private balanceAfter;
}
