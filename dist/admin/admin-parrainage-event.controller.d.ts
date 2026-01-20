import { Repository } from "typeorm";
import { ParrainageEvent } from "../entities/parrainage-event.entity";
import { ApiResponseService } from "../common/services/api-response.service";
export declare class AdminParrainageEventController {
    private eventRepository;
    private apiResponse;
    constructor(eventRepository: Repository<ParrainageEvent>, apiResponse: ApiResponseService);
    index(page?: number, limit?: number, search?: string): Promise<import("../common/interfaces/api-response.interface").PaginatedResponse<ParrainageEvent>>;
    create(): Promise<any>;
    store(data: any): Promise<any>;
    show(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    destroy(id: number): Promise<any>;
    edit(id: number): Promise<any>;
}
