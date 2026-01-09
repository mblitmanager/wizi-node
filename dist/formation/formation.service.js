"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const formation_entity_1 = require("../entities/formation.entity");
const catalogue_formation_entity_1 = require("../entities/catalogue-formation.entity");
let FormationService = class FormationService {
    constructor(formationRepository, catalogueRepository) {
        this.formationRepository = formationRepository;
        this.catalogueRepository = catalogueRepository;
    }
    async getAllFormations() {
        return this.formationRepository.find();
    }
    async getAllCatalogueFormations() {
        return this.catalogueRepository.find();
    }
    async getCatalogueWithFormations() {
        return this.catalogueRepository.find({
            relations: ["stagiaires"],
        });
    }
};
exports.FormationService = FormationService;
exports.FormationService = FormationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(formation_entity_1.Formation)),
    __param(1, (0, typeorm_1.InjectRepository)(catalogue_formation_entity_1.CatalogueFormation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FormationService);
//# sourceMappingURL=formation.service.js.map