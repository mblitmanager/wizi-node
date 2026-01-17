import { Controller, Get, Param, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { join } from "path";
import { statSync, createReadStream } from "fs";

@Controller("medias")
export class MediaStreamController {
  @Get("stream/:filename")
  async streamVideo(
    @Param("filename") filename: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const videoPath = join(process.cwd(), "public/uploads/medias", filename);

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
