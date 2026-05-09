import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    getRoles(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
}
