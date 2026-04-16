import { ProductsService } from './products.service';
import type { AuthUser } from '../auth/current-user.decorator';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    listPublic(branchId?: string, categoryId?: string, q?: string): import("@prisma/client").Prisma.PrismaPromise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    })[]>;
    listAdmin(branchId: string | undefined, user: AuthUser): import("@prisma/client").Prisma.PrismaPromise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    })[]>;
    create(user: AuthUser, body: Record<string, unknown>): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    }>;
    update(user: AuthUser, id: string, body: Record<string, unknown>): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    }>;
    remove(user: AuthUser, id: string): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    }>;
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
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string;
        stock: number;
    }>;
}
