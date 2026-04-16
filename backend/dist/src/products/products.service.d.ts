import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    listPublic(q: {
        branchId?: string;
        categoryId?: string;
        search?: string;
    }): Prisma.PrismaPromise<({
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            createdAt: Date;
            slug: string;
            nameAr: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string;
        branchId: string;
        categoryId: string;
        descriptionAr: string;
        price: Prisma.Decimal;
        imageUrl: string;
        stock: number;
    })[]>;
    getOne(id: string): Promise<{
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            createdAt: Date;
            slug: string;
            nameAr: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string;
        branchId: string;
        categoryId: string;
        descriptionAr: string;
        price: Prisma.Decimal;
        imageUrl: string;
        stock: number;
    }>;
    create(user: AuthUser, data: {
        branchId: string;
        categoryId: string;
        nameAr: string;
        descriptionAr?: string;
        price: number;
        imageUrl?: string;
        stock?: number;
    }): Promise<{
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            createdAt: Date;
            slug: string;
            nameAr: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string;
        branchId: string;
        categoryId: string;
        descriptionAr: string;
        price: Prisma.Decimal;
        imageUrl: string;
        stock: number;
    }>;
    update(user: AuthUser, id: string, data: Partial<{
        categoryId: string;
        nameAr: string;
        descriptionAr: string;
        price: number;
        imageUrl: string;
        stock: number;
        isActive: boolean;
    }>): Promise<{
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            createdAt: Date;
            slug: string;
            nameAr: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string;
        branchId: string;
        categoryId: string;
        descriptionAr: string;
        price: Prisma.Decimal;
        imageUrl: string;
        stock: number;
    }>;
    listAdmin(user: AuthUser, branchId?: string): Prisma.PrismaPromise<({
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            createdAt: Date;
            slug: string;
            nameAr: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string;
        branchId: string;
        categoryId: string;
        descriptionAr: string;
        price: Prisma.Decimal;
        imageUrl: string;
        stock: number;
    })[]>;
    assertProductAccess(user: AuthUser, branchId: string): void;
}
