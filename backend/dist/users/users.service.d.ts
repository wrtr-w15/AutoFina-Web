import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(username: string, password: string): Promise<User>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
