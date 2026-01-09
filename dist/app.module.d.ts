import { NestModule, MiddlewareConsumer } from "@nestjs/common";
export declare class AppModule implements NestModule {
    constructor();
    configure(consumer: MiddlewareConsumer): void;
}
