import { MediaService } from "./media.service";
export declare class StagiaireMediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    watched(id: number, req: any): Promise<import("../entities/media-stagiaire.entity").MediaStagiaire>;
}
