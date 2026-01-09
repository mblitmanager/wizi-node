import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        name: string;
        version: string;
        status: string;
        documentation: string;
        message: string;
    };
    getAdminInterface(): string;
    getAdminRedirect(): string;
}
