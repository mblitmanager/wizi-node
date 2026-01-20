import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
export declare class UserStatusTaskService {
    private userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    handleCron(): Promise<void>;
}
