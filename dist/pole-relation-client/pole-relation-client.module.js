"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoleRelationClientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pole_relation_client_entity_1 = require("../entities/pole-relation-client.entity");
const pole_relation_client_service_1 = require("./pole-relation-client.service");
const pole_relation_client_controller_1 = require("./pole-relation-client.controller");
let PoleRelationClientModule = class PoleRelationClientModule {
};
exports.PoleRelationClientModule = PoleRelationClientModule;
exports.PoleRelationClientModule = PoleRelationClientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pole_relation_client_entity_1.PoleRelationClient])],
        controllers: [pole_relation_client_controller_1.PoleRelationClientController],
        providers: [pole_relation_client_service_1.PoleRelationClientService],
        exports: [pole_relation_client_service_1.PoleRelationClientService],
    })
], PoleRelationClientModule);
//# sourceMappingURL=pole-relation-client.module.js.map