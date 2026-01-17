import { Controller, Get, Param, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { join } from "path";
import { statSync, createReadStream } from "fs";
import { MediaService } from "./media.service";
import * as jwt from "jsonwebtoken";

@Controller("medias")
export class MediaStreamController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("stream/:filename")
  async streamVideo(
    @Param("filename") filename: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const videoPath = join(process.cwd(), "public/uploads/medias", filename);

    // --- Achievement logic (runs before stream) ---
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "secret"; // Use your actual secret
        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.id;

        if (userId) {
          // Find media by filename to mark as watched
          const media = await this.mediaService.findByFilePath(filename);
          if (media && media.categorie === "tutoriel") {
            await this.mediaService.markAsWatched(media.id, userId);
            console.log(
              `Video ${filename} marked as watched for user ${userId}`
            );
          }
        }
      }
    } catch (err) {
      // Ignore auth errors for streaming (non-blocking)
      console.log("Stream auth check failed", err.message);
    }

    try {
      const stats = statSync(videoPath);
      const videoSize = stats.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
        const chunksize = end - start + 1;
        const file = createReadStream(videoPath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };

        res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": videoSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(HttpStatus.OK, head);
        createReadStream(videoPath).pipe(res);
      }
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).send("Video not found");
    }
  }
}
