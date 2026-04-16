import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersController {
    private prisma;
    constructor(prisma: PrismaService);
    listStaff(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        phone: string | null;
        isActive: boolean;
        branchId: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }[]>;
    listDrivers(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        phone: string | null;
        email: string;
    }[]>;
    createStaff(body: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role: Role;
        branchId?: string;
    }): Promise<{
        id: string;
        name: string;
        branchId: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
