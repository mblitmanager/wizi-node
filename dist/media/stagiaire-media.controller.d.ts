import { MediaService } from "./media.service";
export declare class StagiaireMediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    watch(id: number, req: any): Promise<{
        message: string;
        new_achievements: import("../entities/achievement.entity").Achievement[];
    }>;
}
