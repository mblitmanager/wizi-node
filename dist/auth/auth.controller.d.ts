import { AuthService } from "./auth.service";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AuthController {
    private authService;
    private apiResponse;
    constructor(authService: AuthService, apiResponse: ApiResponseService);
    login(credentials: any): Promise<any>;
    register(userData: any): Promise<any>;
    logout(req: any): Promise<any>;
    logoutAll(req: any): Promise<any>;
    refresh(refreshToken: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    updateFcmToken(req: any, token: string): Promise<any>;
    getProfile(req: any): any;
    getMe(req: any): any;
    getUser(req: any): any;
    private transformUser;
}
