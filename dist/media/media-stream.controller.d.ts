import { Request, Response } from "express";
import { MediaService } from "./media.service";
export declare class MediaStreamController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    streamVideo(filename: string, req: Request, res: Response): Promise<void>;
}
