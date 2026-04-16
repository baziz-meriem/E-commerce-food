export type AuthUser = {
    id: string;
    email: string;
    role: import('@prisma/client').Role;
    branchId: string | null;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
