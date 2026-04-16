import { CartService } from './cart.service';
import type { AuthUser } from '../auth/current-user.decorator';
export declare class CartController {
    private cart;
    constructor(cart: CartService);
    get(user: AuthUser): Promise<({
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
    add(user: AuthUser, body: {
        productId: string;
        quantity?: number;
    }): Promise<{
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
    setQty(user: AuthUser, id: string, body: {
        quantity: number;
    }): Promise<({
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
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
