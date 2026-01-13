import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { PoleRelationClientService } from "./pole-relation-client.service";
import { PoleRelationClientController } from "./pole-relation-client.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PoleRelationClient])],
  controllers: [PoleRelationClientController],
  providers: [PoleRelationClientService],
  exports: [PoleRelationClientService],
})
export class PoleRelationClientModule {}
