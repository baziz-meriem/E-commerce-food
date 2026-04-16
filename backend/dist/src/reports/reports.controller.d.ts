import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/current-user.decorator';
export declare class ReportsController {
    private prisma;
    constructor(prisma: PrismaService);
    summary(user: AuthUser, branchId?: string, from?: string, to?: string): Promise<{
        range: {
            from: Date;
            to: Date;
        };
        orderCount: number;
        revenue: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        topProducts: {
            name: string;
            productId: string;
            quantity: number;
        }[];
    }>;
}
