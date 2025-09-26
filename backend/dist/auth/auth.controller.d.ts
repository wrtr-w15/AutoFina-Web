import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    } | {
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): any;
    verifyToken(req: any): {
        valid: boolean;
        user: any;
    };
}
