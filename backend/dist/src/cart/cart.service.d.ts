import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<({
        product: {
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
        };
    } & {
        id: string;
        userId: string;
        quantity: number;
        productId: string;
    })[]>;
    addItem(userId: string, productId: string, quantity: number): Promise<{
        product: {
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
        };
    } & {
        id: string;
        userId: string;
        quantity: number;
        productId: string;
    }>;
    setQuantity(userId: string, itemId: string, quantity: number): Promise<({
        product: {
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
        };
    } & {
        id: string;
        userId: string;
        quantity: number;
        productId: string;
    }) | {
        removed: boolean;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        ok: boolean;
    }>;
}
