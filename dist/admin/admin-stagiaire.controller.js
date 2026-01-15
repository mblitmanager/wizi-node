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
exports.AdminStagiaireController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const user_entity_1 = require("../entities/user.entity");
const stagiaire_catalogue_formation_entity_1 = require("../entities/stagiaire-catalogue-formation.entity");
const commercial_entity_1 = require("../entities/commercial.entity");
const pole_relation_client_entity_1 = require("../entities/pole-relation-client.entity");
const partenaire_entity_1 = require("../entities/partenaire.entity");
const api_response_service_1 = require("../common/services/api-response.service");
const bcrypt = require("bcrypt");
let AdminStagiaireController = class AdminStagiaireController {
    constructor(stagiaireRepository, userRepository, stagiaireCatalogueFormationRepository, commercialRepository, poleRelationClientRepository, partenaireRepository, dataSource, apiResponse) {
        this.stagiaireRepository = stagiaireRepository;
        this.userRepository = userRepository;
        this.stagiaireCatalogueFormationRepository = stagiaireCatalogueFormationRepository;
        this.commercialRepository = commercialRepository;
        this.poleRelationClientRepository = poleRelationClientRepository;
        this.partenaireRepository = partenaireRepository;
        this.dataSource = dataSource;
        this.apiResponse = apiResponse;
    }
    async findAll(page = 1, limit = 10, search = "") {
        try {
            const query = this.stagiaireRepository
                .createQueryBuilder("s")
                .leftJoinAndSelect("s.user", "user");
            if (search) {
                query.where("s.prenom LIKE :search OR s.nom LIKE :search OR s.ville LIKE :search OR user.email LIKE :search", { search: `%${search}%` });
            }
            const [data, total] = await query
                .skip((page - 1) * limit)
                .take(limit)
                .orderBy("s.id", "DESC")
                .getManyAndCount();
            return this.apiResponse.paginated(data, total, page, limit);
        }
        catch (error) {
            fs.appendFileSync("debug_500_errors.log", `[AdminStagiaireController] Error: ${error.message}\nStack: ${error.stack}\n\n`);
            console.error("Error in findAll stagiaires:", error);
            return this.apiResponse.paginated([], 0, page, limit);
        }
    }
    async findOne(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
            relations: [
                "user",
                "stagiaire_catalogue_formations",
                "stagiaire_catalogue_formations.catalogue_formation",
                "stagiaire_catalogue_formations.catalogue_formation.formation",
                "commercials",
                "commercials.user",
                "poleRelationClients",
                "poleRelationClients.user",
                "partenaire",
                "achievements",
            ],
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        return this.apiResponse.success(stagiaire);
    }
    async create(body) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!body.name || !body.email || !body.password) {
                throw new common_1.BadRequestException("name, email et password sont obligatoires");
            }
            const existingUser = await this.userRepository.findOne({
                where: { email: body.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException("Cet email est déjà utilisé");
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const laravelPassword = hashedPassword.replace(/^\$2b\$/, "$2y$");
            const user = this.userRepository.create({
                name: body.name,
                email: body.email,
                password: laravelPassword,
                role: "stagiaire",
            });
            const savedUser = await queryRunner.manager.save(user);
            const stagiaire = this.stagiaireRepository.create({
                user_id: savedUser.id,
                civilite: body.civilite || null,
                prenom: body.prenom || null,
                telephone: body.telephone || null,
                adresse: body.adresse || null,
                ville: body.ville || null,
                code_postal: body.code_postal || null,
                date_naissance: body.date_naissance || null,
                date_debut_formation: body.date_debut_formation || null,
                date_inscription: body.date_inscription || null,
                partenaire_id: body.partenaire_id || null,
                statut: "1",
            });
            const savedStagiaire = await queryRunner.manager.save(stagiaire);
            if (body.formations && typeof body.formations === "object") {
                const formationsToSync = [];
                for (const [fid, vals] of Object.entries(body.formations)) {
                    if (vals && typeof vals === "object" && vals.selected) {
                        formationsToSync.push({
                            stagiaire_id: savedStagiaire.id,
                            catalogue_formation_id: parseInt(fid),
                            date_debut: vals.date_debut || null,
                            date_inscription: vals.date_inscription || null,
                            date_fin: vals.date_fin || null,
                            formateur_id: vals.formateur_id || null,
                        });
                    }
                }
                if (formationsToSync.length > 0) {
                    await queryRunner.manager.save(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation, formationsToSync);
                }
            }
            if (body.commercial_id && Array.isArray(body.commercial_id)) {
                const commercialIds = body.commercial_id
                    .map((id) => parseInt(id))
                    .filter((id) => !isNaN(id));
                if (commercialIds.length > 0) {
                    const commercials = await this.commercialRepository.findBy({
                        id: (0, typeorm_2.In)(commercialIds),
                    });
                    savedStagiaire.commercials = commercials;
                    await queryRunner.manager.save(savedStagiaire);
                }
            }
            if (body.pole_relation_client_id &&
                Array.isArray(body.pole_relation_client_id)) {
                const poleIds = body.pole_relation_client_id
                    .map((id) => parseInt(id))
                    .filter((id) => !isNaN(id));
                if (poleIds.length > 0) {
                    const poles = await this.poleRelationClientRepository.findBy({
                        id: (0, typeorm_2.In)(poleIds),
                    });
                    savedStagiaire.poleRelationClients = poles;
                    await queryRunner.manager.save(savedStagiaire);
                }
            }
            await queryRunner.commitTransaction();
            const result = await this.stagiaireRepository.findOne({
                where: { id: savedStagiaire.id },
                relations: [
                    "user",
                    "stagiaire_catalogue_formations",
                    "stagiaire_catalogue_formations.catalogue_formation",
                    "commercials",
                    "commercials.user",
                    "poleRelationClients",
                    "poleRelationClients.user",
                ],
            });
            return this.apiResponse.success(result);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error creating stagiaire:", error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, body) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const stagiaire = await this.stagiaireRepository.findOne({
                where: { id },
                relations: ["user"],
            });
            if (!stagiaire) {
                throw new common_1.NotFoundException("Stagiaire non trouvé");
            }
            if (stagiaire.user) {
                if (body.name !== undefined) {
                    stagiaire.user.name = body.name;
                }
                if (body.email !== undefined) {
                    const existingUser = await this.userRepository.findOne({
                        where: { email: body.email },
                    });
                    if (existingUser && existingUser.id !== stagiaire.user.id) {
                        throw new common_1.BadRequestException("Cet email est déjà utilisé");
                    }
                    stagiaire.user.email = body.email;
                }
                if (body.password && body.password.trim() !== "") {
                    const hashedPassword = await bcrypt.hash(body.password, 10);
                    const laravelPassword = hashedPassword.replace(/^\$2b\$/, "$2y$");
                    stagiaire.user.password = laravelPassword;
                }
                await queryRunner.manager.save(stagiaire.user);
            }
            if (body.civilite !== undefined)
                stagiaire.civilite = body.civilite;
            if (body.prenom !== undefined)
                stagiaire.prenom = body.prenom;
            if (body.telephone !== undefined)
                stagiaire.telephone = body.telephone;
            if (body.adresse !== undefined)
                stagiaire.adresse = body.adresse;
            if (body.ville !== undefined)
                stagiaire.ville = body.ville;
            if (body.code_postal !== undefined)
                stagiaire.code_postal = body.code_postal;
            if (body.date_naissance !== undefined)
                stagiaire.date_naissance = body.date_naissance;
            if (body.partenaire_id !== undefined)
                stagiaire.partenaire_id = body.partenaire_id || null;
            await queryRunner.manager.save(stagiaire);
            if (body.formations && typeof body.formations === "object") {
                await queryRunner.manager.delete(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation, {
                    stagiaire_id: id,
                });
                const formationsToSync = [];
                for (const [fid, vals] of Object.entries(body.formations)) {
                    if (vals && typeof vals === "object" && vals.selected) {
                        formationsToSync.push({
                            stagiaire_id: id,
                            catalogue_formation_id: parseInt(fid),
                            date_debut: vals.date_debut || null,
                            date_inscription: vals.date_inscription || null,
                            date_fin: vals.date_fin || null,
                            formateur_id: vals.formateur_id || null,
                        });
                    }
                }
                if (formationsToSync.length > 0) {
                    await queryRunner.manager.save(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation, formationsToSync);
                }
            }
            if (body.commercial_id !== undefined) {
                const commercialIds = Array.isArray(body.commercial_id)
                    ? body.commercial_id
                        .map((id) => parseInt(id))
                        .filter((id) => !isNaN(id))
                    : [];
                const commercials = commercialIds.length > 0
                    ? await this.commercialRepository.findBy({
                        id: (0, typeorm_2.In)(commercialIds),
                    })
                    : [];
                stagiaire.commercials = commercials;
                await queryRunner.manager.save(stagiaire);
            }
            if (body.pole_relation_client_id !== undefined) {
                const poleIds = Array.isArray(body.pole_relation_client_id)
                    ? body.pole_relation_client_id
                        .map((id) => parseInt(id))
                        .filter((id) => !isNaN(id))
                    : [];
                const poles = poleIds.length > 0
                    ? await this.poleRelationClientRepository.findBy({
                        id: (0, typeorm_2.In)(poleIds),
                    })
                    : [];
                stagiaire.poleRelationClients = poles;
                await queryRunner.manager.save(stagiaire);
            }
            await queryRunner.commitTransaction();
            const updated = await this.stagiaireRepository.findOne({
                where: { id },
                relations: [
                    "user",
                    "stagiaire_catalogue_formations",
                    "stagiaire_catalogue_formations.catalogue_formation",
                    "stagiaire_catalogue_formations.catalogue_formation.formation",
                    "commercials",
                    "commercials.user",
                    "poleRelationClients",
                    "poleRelationClients.user",
                    "achievements",
                ],
            });
            return this.apiResponse.success(updated);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error updating stagiaire:", error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { id },
        });
        if (!stagiaire) {
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        }
        await this.stagiaireRepository.delete(id);
        return this.apiResponse.success();
    }
    async active(id) {
        const stagiaire = await this.stagiaireRepository.findOne({ where: { id } });
        if (!stagiaire)
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        stagiaire.statut = "1";
        await this.stagiaireRepository.save(stagiaire);
        return this.apiResponse.success({ message: "Stagiaire activé" });
    }
    async desactive(id) {
        const stagiaire = await this.stagiaireRepository.findOne({ where: { id } });
        if (!stagiaire)
            throw new common_1.NotFoundException("Stagiaire non trouvé");
        stagiaire.statut = "0";
        await this.stagiaireRepository.save(stagiaire);
        return this.apiResponse.success({ message: "Stagiaire désactivé" });
    }
};
exports.AdminStagiaireController = AdminStagiaireController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(":id/active"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "active", null);
__decorate([
    (0, common_1.Patch)(":id/desactive"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminStagiaireController.prototype, "desactive", null);
exports.AdminStagiaireController = AdminStagiaireController = __decorate([
    (0, common_1.Controller)("admin/stagiaires"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrateur", "admin"),
    __param(0, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(stagiaire_catalogue_formation_entity_1.StagiaireCatalogueFormation)),
    __param(3, (0, typeorm_1.InjectRepository)(commercial_entity_1.Commercial)),
    __param(4, (0, typeorm_1.InjectRepository)(pole_relation_client_entity_1.PoleRelationClient)),
    __param(5, (0, typeorm_1.InjectRepository)(partenaire_entity_1.Partenaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        api_response_service_1.ApiResponseService])
], AdminStagiaireController);
//# sourceMappingURL=admin-stagiaire.controller.js.map