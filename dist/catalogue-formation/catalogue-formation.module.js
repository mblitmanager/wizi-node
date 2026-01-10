"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueFormationModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../common/common.module");
const typeorm_1 = require("@nestjs/typeorm");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const catalogue_formation_controller_1 = require("./catalogue-formation.controller");
const catalogue_formation_service_1 = require("./catalogue-formation.service");
let CatalogueFormationModule = class CatalogueFormationModule {
};
exports.CatalogueFormationModule = CatalogueFormationModule;
exports.CatalogueFormationModule = CatalogueFormationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forFeature([
                catalogue_formation_entity_1.CatalogueFormation,
                stagiaire_entity_1.Stagiaire,
                stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation,
            ]),
        ],
        controllers: [catalogue_formation_controller_1.CatalogueFormationController],
        providers: [catalogue_formation_service_1.CatalogueFormationService],
        exports: [catalogue_formation_service_1.CatalogueFormationService],
    })
], CatalogueFormationModule);
//# sourceMappingURL=catalogue-formation.module.js.map