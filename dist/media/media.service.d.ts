import { Repository } from "typeorm";
import { Media } from "../entities/media.entity";
export declare class MediaService {
    private mediaRepository;
    constructor(mediaRepository: Repository<Media>);
    findAll(): Promise<Media[]>;
    findByType(type: string): Promise<Media[]>;
}
