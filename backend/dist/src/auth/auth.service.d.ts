import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string | null;
            branchId: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            branchId: string | null;
        };
        accessToken: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        branchId: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    private sign;
}
