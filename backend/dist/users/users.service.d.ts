import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(userData: {
        username: string;
        password: string;
        role?: string;
        is_active?: boolean;
    }): Promise<User>;
    updatePassword(id: number, hashedPassword: string): Promise<void>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
