import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddFormateurIdToAgenda1768989917161 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
