import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

@Injectable()
export class S3StorageService implements OnModuleInit {
  private s3Client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.bucket = this.configService.get<string>("S3_BUCKET") || "wizi-medias";
    this.publicUrl =
      this.configService.get<string>("S3_PUBLIC_URL") ||
      "http://localhost:9000/wizi-medias";

    this.s3Client = new S3Client({
      region: this.configService.get<string>("S3_REGION") || "us-east-1",
      endpoint:
        this.configService.get<string>("S3_ENDPOINT") || "http://minio:9000",
      credentials: {
        accessKeyId: this.configService.get<string>("S3_ACCESS_KEY") || "admin",
        secretAccessKey:
          this.configService.get<string>("S3_SECRET_KEY") || "password123",
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<{ key: string; url: string }> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.originalname.split(".").pop();
    const key = `${folder}/${timestamp}_${randomString}.${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return {
      key,
      url: `${this.publicUrl}/${key}`,
    };
  }

  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return `${this.publicUrl}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}
