import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParrainageService } from "./parrainage.service";
import { ParrainageController } from "./parrainage.controller";
import { Parrainage } from "../entities/parrainage.entity";
import { ParrainageToken } from "../entities/parrainage-token.entity";
import { User } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Parrainage, ParrainageToken, User])],
  providers: [ParrainageService],
  controllers: [ParrainageController],
  exports: [ParrainageService],
})
export class ParrainageModule {}
