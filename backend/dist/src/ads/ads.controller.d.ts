import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdsController {
    private prisma;
    constructor(prisma: PrismaService);
    listPublic(branchId?: string): Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string | null;
        imageUrl: string;
        titleAr: string;
        linkUrl: string;
        sortOrder: number;
        startAt: Date | null;
        endAt: Date | null;
    }[]>;
    listAll(): Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string | null;
        imageUrl: string;
        titleAr: string;
        linkUrl: string;
        sortOrder: number;
        startAt: Date | null;
        endAt: Date | null;
    }[]>;
    create(body: {
        titleAr: string;
        imageUrl?: string;
        linkUrl?: string;
        branchId?: string | null;
        sortOrder?: number;
        isActive?: boolean;
        startAt?: string | null;
        endAt?: string | null;
    }): Prisma.Prisma__AdClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string | null;
        imageUrl: string;
        titleAr: string;
        linkUrl: string;
        sortOrder: number;
        startAt: Date | null;
        endAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, body: Partial<{
        titleAr: string;
        imageUrl: string;
        linkUrl: string;
        branchId: string | null;
        sortOrder: number;
        isActive: boolean;
        startAt: string | null;
        endAt: string | null;
    }>): Prisma.Prisma__AdClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string | null;
        imageUrl: string;
        titleAr: string;
        linkUrl: string;
        sortOrder: number;
        startAt: Date | null;
        endAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    remove(id: string): Prisma.Prisma__AdClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        branchId: string | null;
        imageUrl: string;
        titleAr: string;
        linkUrl: string;
        sortOrder: number;
        startAt: Date | null;
        endAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
