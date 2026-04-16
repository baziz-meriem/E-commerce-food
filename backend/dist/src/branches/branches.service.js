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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BranchesService = class BranchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllPublic() {
        return this.prisma.branch.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const b = await this.prisma.branch.findUnique({ where: { id } });
        if (!b)
            throw new common_1.NotFoundException();
        return b;
    }
    findAllAdmin() {
        return this.prisma.branch.findMany({ orderBy: { name: 'asc' } });
    }
    async create(data) {
        return this.prisma.branch.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.branch.update({ where: { id }, data });
    }
    assertBranchAccess(user, branchId) {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')
            return;
        if (user.role === 'BRANCH_MANAGER' && user.branchId === branchId)
            return;
        throw new common_1.ForbiddenException();
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BranchesService);
//# sourceMappingURL=branches.service.js.map