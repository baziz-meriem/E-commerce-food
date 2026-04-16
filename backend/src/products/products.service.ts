import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listPublic(q: {
    branchId?: string;
    categoryId?: string;
    search?: string;
  }) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      stock: { gt: 0 },
    };
    if (q.branchId) where.branchId = q.branchId;
    if (q.categoryId) where.categoryId = q.categoryId;
    if (q.search) {
      where.nameAr = { contains: q.search };
    }
    return this.prisma.product.findMany({
      where,
      include: { category: true, branch: true },
      orderBy: { nameAr: 'asc' },
    });
  }

  async getOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, branch: true },
    });
    if (!p || !p.isActive) throw new NotFoundException();
    return p;
  }

  async create(
    user: AuthUser,
    data: {
      branchId: string;
      categoryId: string;
      nameAr: string;
      descriptionAr?: string;
      price: number;
      imageUrl?: string;
      stock?: number;
    },
  ) {
    this.assertProductAccess(user, data.branchId);
    return this.prisma.product.create({
      data: {
        branchId: data.branchId,
        categoryId: data.categoryId,
        nameAr: data.nameAr,
        descriptionAr: data.descriptionAr ?? '',
        price: new Prisma.Decimal(data.price),
        imageUrl: data.imageUrl ?? '',
        stock: data.stock ?? 0,
      },
      include: { category: true, branch: true },
    });
  }

  async update(
    user: AuthUser,
    id: string,
    data: Partial<{
      categoryId: string;
      nameAr: string;
      descriptionAr: string;
      price: number;
      imageUrl: string;
      stock: number;
      isActive: boolean;
    }>,
  ) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    this.assertProductAccess(user, existing.branchId);
    const patch: Prisma.ProductUpdateInput = { ...data };
    if (data.price !== undefined)
      patch.price = new Prisma.Decimal(data.price);
    return this.prisma.product.update({
      where: { id },
      data: patch,
      include: { category: true, branch: true },
    });
  }

  listAdmin(user: AuthUser, branchId?: string) {
    const bid =
      user.role === 'BRANCH_MANAGER' ? user.branchId ?? undefined : branchId;
    return this.prisma.product.findMany({
      where: bid ? { branchId: bid } : {},
      include: { category: true, branch: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  assertProductAccess(user: AuthUser, branchId: string) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return;
    if (user.role === 'BRANCH_MANAGER' && user.branchId === branchId) return;
    throw new ForbiddenException();
  }
}
