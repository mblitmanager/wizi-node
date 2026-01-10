"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const formation_entity_1 = require("../entities/formation.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const formation_service_1 = require("./formation.service");
const formation_controller_1 = require("./formation.controller");
let FormationModule = class FormationModule {
};
exports.FormationModule = FormationModule;
exports.FormationModule = FormationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([formation_entity_1.Formation, catalogue_formation_entity_1.CatalogueFormation])],
        controllers: [formation_controller_1.FormationController],
        providers: [formation_service_1.FormationService],
        exports: [formation_service_1.FormationService],
    })
], FormationModule);
//# sourceMappingURL=formation.module.js.map