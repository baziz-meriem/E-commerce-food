import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthUser } from './current-user.decorator';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
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
    me(user: AuthUser): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        branchId: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
