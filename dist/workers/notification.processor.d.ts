import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { FcmService } from "../notification/fcm.service";
export declare class NotificationProcessor extends WorkerHost {
    private fcmService;
    private readonly logger;
    constructor(fcmService: FcmService);
    process(job: Job<any, any, string>): Promise<any>;
}
