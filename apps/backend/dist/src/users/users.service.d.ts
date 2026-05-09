import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        opd: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    }>;
    findByEmail(email: string): Promise<({
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        opd: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    }) | null>;
    findOne(id: string): Promise<{
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        opd: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<({
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        opd: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    })[]>;
    update(id: string, data: UpdateUserDto): Promise<{
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        opd: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        roleId: string;
        opdId: string | null;
        deletedAt: Date | null;
    }>;
    getRoles(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
