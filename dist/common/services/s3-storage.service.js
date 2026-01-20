"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3StorageService = class S3StorageService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.bucket = this.configService.get("S3_BUCKET") || "wizi-medias";
        this.publicUrl =
            this.configService.get("S3_PUBLIC_URL") ||
                "http://localhost:9000/wizi-medias";
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get("S3_REGION") || "us-east-1",
            endpoint: this.configService.get("S3_ENDPOINT") || "http://minio:9000",
            credentials: {
                accessKeyId: this.configService.get("S3_ACCESS_KEY") || "admin",
                secretAccessKey: this.configService.get("S3_SECRET_KEY") || "password123",
            },
            forcePathStyle: true,
        });
    }
    async uploadFile(file, folder = "uploads") {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.originalname.split(".").pop();
        const key = `${folder}/${timestamp}_${randomString}.${extension}`;
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        return {
            key,
            url: `${this.publicUrl}/${key}`,
        };
    }
    async uploadBuffer(buffer, key, contentType) {
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));
        return `${this.publicUrl}/${key}`;
    }
    async getSignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    async deleteFile(key) {
        await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
    async fileExists(key) {
        try {
            await this.s3Client.send(new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
    getPublicUrl(key) {
        return `${this.publicUrl}/${key}`;
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map