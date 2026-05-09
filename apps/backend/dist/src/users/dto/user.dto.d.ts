export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    roleId: string;
    opdId?: string;
}
export declare class UpdateUserDto {
    name?: string;
    roleId?: string;
    opdId?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
