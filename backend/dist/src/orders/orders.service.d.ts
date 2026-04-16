import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';
import { LoyaltyService } from '../loyalty/loyalty.service';
export declare class OrdersService {
    private prisma;
    private loyalty;
    constructor(prisma: PrismaService, loyalty: LoyaltyService);
    checkout(userId: string, dto: {
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    listForUser(userId: string): Promise<({
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    updateStatus(user: AuthUser, id: string, status: OrderStatus): Promise<{
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    assignDriver(user: AuthUser, orderId: string, driverId: string): Promise<{
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    }>;
    listForDriver(userId: string): Promise<({
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
            unitPrice: Prisma.Decimal;
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
        subtotal: Prisma.Decimal;
        deliveryFee: Prisma.Decimal;
        loyaltyDiscount: Prisma.Decimal;
        total: Prisma.Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        codCollected: boolean;
        deliveryAddress: string;
        deliveryPhone: string;
        notes: string;
        driverId: string | null;
    })[]>;
    private assertCanManageOrder;
}
