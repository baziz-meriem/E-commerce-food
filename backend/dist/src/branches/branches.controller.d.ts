import { BranchesService } from './branches.service';
export declare class BranchesController {
    private branches;
    constructor(branches: BranchesService);
    listPublic(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    listAdmin(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: {
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
    update(id: string, body: {
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
    getOne(id: string): Promise<{
        id: string;
        name: string;
        address: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
