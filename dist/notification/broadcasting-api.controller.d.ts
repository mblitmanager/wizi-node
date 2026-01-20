import { ApiResponseService } from "../common/services/api-response.service";
export declare class BroadcastingApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    auth(req: any, body: any): Promise<{
        auth: string;
        channel_data: string;
    }>;
}
