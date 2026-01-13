import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export declare class S3StorageService implements OnModuleInit {
    private configService;
    private s3Client;
    private bucket;
    private publicUrl;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        key: string;
        url: string;
    }>;
    uploadBuffer(buffer: Buffer, key: string, contentType: string): Promise<string>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    fileExists(key: string): Promise<boolean>;
    getPublicUrl(key: string): string;
}
