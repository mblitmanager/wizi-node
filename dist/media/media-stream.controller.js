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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStreamController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const media_service_1 = require("./media.service");
const jwt = require("jsonwebtoken");
let MediaStreamController = class MediaStreamController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async streamVideo(filename, req, res) {
        const videoPath = (0, path_1.join)(process.cwd(), "public/uploads/medias", filename);
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const secret = process.env.JWT_SECRET || "secret";
                const decoded = jwt.verify(token, secret);
                const userId = decoded.id;
                if (userId) {
                    const media = await this.mediaService.findByFilePath(filename);
                    if (media && media.categorie === "tutoriel") {
                        await this.mediaService.markAsWatched(media.id, userId);
                        console.log(`Video ${filename} marked as watched for user ${userId}`);
                    }
                }
            }
        }
        catch (err) {
            console.log("Stream auth check failed", err.message);
        }
        try {
            const stats = (0, fs_1.statSync)(videoPath);
            const videoSize = stats.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
                const chunksize = end - start + 1;
                const file = (0, fs_1.createReadStream)(videoPath, { start, end });
                const head = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "video/mp4",
                };
                res.writeHead(common_1.HttpStatus.PARTIAL_CONTENT, head);
                file.pipe(res);
            }
            else {
                const head = {
                    "Content-Length": videoSize,
                    "Content-Type": "video/mp4",
                };
                res.writeHead(common_1.HttpStatus.OK, head);
                (0, fs_1.createReadStream)(videoPath).pipe(res);
            }
        }
        catch (err) {
            res.status(common_1.HttpStatus.NOT_FOUND).send("Video not found");
        }
    }
};
exports.MediaStreamController = MediaStreamController;
__decorate([
    (0, common_1.Get)("stream/:filename"),
    __param(0, (0, common_1.Param)("filename")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaStreamController.prototype, "streamVideo", null);
exports.MediaStreamController = MediaStreamController = __decorate([
    (0, common_1.Controller)("medias"),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaStreamController);
//# sourceMappingURL=media-stream.controller.js.map