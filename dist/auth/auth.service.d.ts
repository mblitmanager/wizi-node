import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
import { MailService } from "../mail/mail.service";
export declare class AuthService {
    private userRepository;
    private jwtService;
    private mailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, mailService: MailService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        token: string;
        refresh_token: string;
        user: any;
    }>;
    register(userData: any): Promise<any>;
    updateFcmToken(userId: number, token: string): Promise<void>;
}
