import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllPublic(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllAdmin(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(data: {
        name: string;
        address: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        address?: string;
        phone?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assertBranchAccess(user: AuthUser, branchId: string): void;
}
