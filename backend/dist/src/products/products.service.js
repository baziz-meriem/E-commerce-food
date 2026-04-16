"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listPublic(q) {
        const where = {
            isActive: true,
            stock: { gt: 0 },
        };
        if (q.branchId)
            where.branchId = q.branchId;
        if (q.categoryId)
            where.categoryId = q.categoryId;
        if (q.search) {
            where.nameAr = { contains: q.search };
        }
        return this.prisma.product.findMany({
            where,
            include: { category: true, branch: true },
            orderBy: { nameAr: 'asc' },
        });
    }
    async getOne(id) {
        const p = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, branch: true },
        });
        if (!p || !p.isActive)
            throw new common_1.NotFoundException();
        return p;
    }
    async create(user, data) {
        this.assertProductAccess(user, data.branchId);
        return this.prisma.product.create({
            data: {
                branchId: data.branchId,
                categoryId: data.categoryId,
                nameAr: data.nameAr,
                descriptionAr: data.descriptionAr ?? '',
                price: new client_1.Prisma.Decimal(data.price),
                imageUrl: data.imageUrl ?? '',
                stock: data.stock ?? 0,
            },
            include: { category: true, branch: true },
        });
    }
    async update(user, id, data) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException();
        this.assertProductAccess(user, existing.branchId);
        const patch = { ...data };
        if (data.price !== undefined)
            patch.price = new client_1.Prisma.Decimal(data.price);
        return this.prisma.product.update({
            where: { id },
            data: patch,
            include: { category: true, branch: true },
        });
    }
    listAdmin(user, branchId) {
        const bid = user.role === 'BRANCH_MANAGER' ? user.branchId ?? undefined : branchId;
        return this.prisma.product.findMany({
            where: bid ? { branchId: bid } : {},
            include: { category: true, branch: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
    assertProductAccess(user, branchId) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')
            return;
        if (user.role === 'BRANCH_MANAGER' && user.branchId === branchId)
            return;
        throw new common_1.ForbiddenException();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map