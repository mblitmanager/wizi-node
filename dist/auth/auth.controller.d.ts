import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(credentials: any): Promise<{
        access_token: string;
        user: any;
    } | {
        error: string;
    }>;
    register(userData: any): Promise<any>;
    getProfile(req: any): any;
    getMe(req: any): any;
    getUser(req: any): any;
}
