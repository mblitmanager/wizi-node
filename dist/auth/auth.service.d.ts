import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        token: string;
        refresh_token: string;
        user: any;
    }>;
    register(userData: any): Promise<any>;
    updateFcmToken(userId: number, token: string): Promise<void>;
}
