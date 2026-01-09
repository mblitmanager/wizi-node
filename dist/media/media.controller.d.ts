import { MediaService } from "./media.service";
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(): Promise<import("../entities/media.entity").Media[]>;
    getTutoriels(): Promise<import("../entities/media.entity").Media[]>;
    getAstuces(): Promise<import("../entities/media.entity").Media[]>;
}
