import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(credentials: any): Promise<{
        token: string;
        refresh_token: string;
        user: any;
    } | {
        error: string;
    }>;
    register(userData: any): Promise<any>;
    updateFcmToken(req: any, token: string): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
    getMe(req: any): any;
    getUser(req: any): any;
    private transformUser;
}
