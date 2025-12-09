export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneOrTelegram?: string;
    group?: string;
    accessUntil?: string;
    tariff?: string;
    faculty?: string;
    curatorId?: string;
    isAdmin?: boolean;
    isCurator?: boolean;
}
