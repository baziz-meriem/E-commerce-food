import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import type { AuthUser } from '../auth/current-user.decorator';
export declare class OrdersController {
    private orders;
    constructor(orders: OrdersService);
    checkout(user: AuthUser, body: {
        deliveryAddress: string;
        deliveryPhone: string;
        notes?: string;
        redeemPoints?: number;
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
        user: {
            id: string;
            name: string;
            phone: string | null;
            email: string;
        };
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    myOrders(user: AuthUser): Promise<({
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        driver: {
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    })[]>;
    listAdmin(user: AuthUser, branchId?: string): Promise<({
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
            phone: string | null;
            email: string;
        };
        driver: {
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    })[]>;
    driverList(user: AuthUser): Promise<({
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
            phone: string | null;
        };
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    })[]>;
    getOne(user: AuthUser, id: string): Promise<{
        branch: {
            id: string;
            name: string;
            address: string;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
            phone: string | null;
            email: string;
        };
        driver: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    updateStatus(user: AuthUser, id: string, body: {
        status: OrderStatus;
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
        user: {
            name: string;
            phone: string | null;
            email: string;
        };
        driver: {
            id: string;
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    assignDriver(user: AuthUser, id: string, body: {
        driverId: string;
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
        driver: {
            name: string;
            phone: string | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            nameSnapshot: string;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        loyaltyDiscount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
}
