import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesController {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        slug: string;
        nameAr: string;
    }[]>;
    getOne(id: string): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        createdAt: Date;
        slug: string;
        nameAr: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(body: {
        nameAr: string;
        slug: string;
    }): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        createdAt: Date;
        slug: string;
        nameAr: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: {
        nameAr?: string;
        slug?: string;
    }): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        createdAt: Date;
        slug: string;
        nameAr: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
