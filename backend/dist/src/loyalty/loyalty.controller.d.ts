import { LoyaltyService } from './loyalty.service';
import type { AuthUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
export declare class LoyaltyController {
    private loyalty;
    private prisma;
    constructor(loyalty: LoyaltyService, prisma: PrismaService);
    me(user: AuthUser): Promise<{
        balance: number;
        settings: {
            id: string;
            pointsPerCurrencyUnit: import("@prisma/client/runtime/library").Decimal;
            redeemPointsPerUnit: import("@prisma/client/runtime/library").Decimal;
            minRedeemPoints: number;
        };
    }>;
    history(user: AuthUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.LoyaltyType;
        points: number;
        balanceAfter: number;
        description: string;
        orderId: string | null;
    }[]>;
    adjust(body: {
        userId: string;
        pointsDelta: number;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.LoyaltyType;
        points: number;
        balanceAfter: number;
        description: string;
        orderId: string | null;
    }>;
}
