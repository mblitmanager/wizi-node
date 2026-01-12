import { ApiResponseService } from "../common/services/api-response.service";
export declare class AutoRemindersApiController {
    private apiResponse;
    constructor(apiResponse: ApiResponseService);
    history(): Promise<any>;
    stats(): Promise<any>;
    targeted(): Promise<any>;
    run(): Promise<any>;
}
