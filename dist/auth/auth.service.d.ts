import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
import { LoginHistory } from "../entities/login-history.entity";
import { MailService } from "../mail/mail.service";
export declare class AuthService {
    private userRepository;
    private loginHistoryRepository;
    private jwtService;
    private mailService;
    constructor(userRepository: Repository<User>, loginHistoryRepository: Repository<LoginHistory>, jwtService: JwtService, mailService: MailService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any, req?: any): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            email_verified_at: any;
            role: any;
            image: any;
            created_at: string;
            updated_at: string;
            last_login_at: string;
            last_activity_at: string;
            last_login_ip: any;
            is_online: number;
            fcm_token: any;
            last_client: any;
            adresse: any;
        };
        stagiaire: any;
        token: string;
        refresh_token: string;
    }>;
    transformUser(user: any): {
        user: {
            id: any;
            name: any;
            email: any;
            email_verified_at: any;
            role: any;
            image: any;
            created_at: string;
            updated_at: string;
            last_login_at: string;
            last_activity_at: string;
            last_login_ip: any;
            is_online: number;
            fcm_token: any;
            last_client: any;
            adresse: any;
        };
        stagiaire: any;
    };
    register(userData: any): Promise<any>;
    updateFcmToken(userId: number, token: string): Promise<void>;
    logout(userId: number): Promise<boolean>;
    logoutAll(userId: number): Promise<boolean>;
}
