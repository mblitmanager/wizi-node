import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  Patch,
} from "@nestjs/common";
import * as fs from "fs";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, In } from "typeorm";
import { Stagiaire } from "../entities/stagiaire.entity";
import { User } from "../entities/user.entity";
import { StagiaireCatalogueFormation } from "../entities/stagiaire-catalogue-formation.entity";
import { Commercial } from "../entities/commercial.entity";
import { PoleRelationClient } from "../entities/pole-relation-client.entity";
import { Partenaire } from "../entities/partenaire.entity";
import { ApiResponseService } from "../common/services/api-response.service";
import * as bcrypt from "bcrypt";

@Controller("admin/stagiaires")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("administrateur", "admin")
export class AdminStagiaireController {
  constructor(
    @InjectRepository(Stagiaire)
    private stagiaireRepository: Repository<Stagiaire>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(StagiaireCatalogueFormation)
    private stagiaireCatalogueFormationRepository: Repository<StagiaireCatalogueFormation>,
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>,
    @InjectRepository(PoleRelationClient)
    private poleRelationClientRepository: Repository<PoleRelationClient>,
    @InjectRepository(Partenaire)
    private partenaireRepository: Repository<Partenaire>,
    private dataSource: DataSource,
    private apiResponse: ApiResponseService
  ) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search: string = ""
  ) {
    try {
      const query = this.stagiaireRepository
        .createQueryBuilder("s")
        .leftJoinAndSelect("s.user", "user");

      if (search) {
        query.where(
          "s.prenom LIKE :search OR user.name LIKE :search OR s.ville LIKE :search OR user.email LIKE :search",
          { search: `%${search}%` }
        );
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy("s.id", "DESC")
        .getManyAndCount();

      return this.apiResponse.paginated(data, total, page, limit);
    } catch (error) {
      fs.appendFileSync(
        "debug_500_errors.log",
        `[AdminStagiaireController] Error: ${error.message}\nStack: ${error.stack}\n\n`
      );
      console.error("Error in findAll stagiaires:", error);
      return this.apiResponse.paginated([], 0, page, limit);
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
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
      throw new NotFoundException("Stagiaire non trouvé");
    }

    return this.apiResponse.success(stagiaire);
  }

  @Post()
  async create(@Body() body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validation
      if (!body.name || !body.email || !body.password) {
        throw new BadRequestException(
          "name, email et password sont obligatoires"
        );
      }

      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: body.email },
      });
      if (existingUser) {
        throw new BadRequestException("Cet email est déjà utilisé");
      }

      // Create User
      const hashedPassword = await bcrypt.hash(body.password, 10);
      // Laravel uses $2y$ prefix, but bcrypt uses $2b$, we'll convert it
      const laravelPassword = hashedPassword.replace(/^\$2b\$/, "$2y$");

      const user = this.userRepository.create({
        name: body.name,
        email: body.email,
        password: laravelPassword,
        role: "stagiaire",
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create Stagiaire
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
        statut: "1", // Active by default (string to match Laravel)
      });
      const savedStagiaire = await queryRunner.manager.save(stagiaire) as Stagiaire;

      // Handle formations
      if (body.formations && typeof body.formations === "object") {
        const formationsToSync: any[] = [];
        for (const [fid, vals] of Object.entries(body.formations)) {
          if (vals && typeof vals === "object" && (vals as any).selected) {
            formationsToSync.push({
              stagiaire_id: savedStagiaire.id,
              catalogue_formation_id: parseInt(fid),
              date_debut: (vals as any).date_debut || null,
              date_inscription: (vals as any).date_inscription || null,
              date_fin: (vals as any).date_fin || null,
              formateur_id: (vals as any).formateur_id || null,
            });
          }
        }
        if (formationsToSync.length > 0) {
          await queryRunner.manager.save(
            StagiaireCatalogueFormation,
            formationsToSync
          );
        }
      }

      // Handle commercials
      if (body.commercial_id && Array.isArray(body.commercial_id)) {
        const commercialIds = body.commercial_id
          .map((id: any) => parseInt(id))
          .filter((id: number) => !isNaN(id));
        if (commercialIds.length > 0) {
          const commercials = await this.commercialRepository.findBy({
            id: In(commercialIds),
          });
          (savedStagiaire as any).commercials = commercials;
          await queryRunner.manager.save(savedStagiaire);
        }
      }

      // Handle pole relation clients
      if (
        body.pole_relation_client_id &&
        Array.isArray(body.pole_relation_client_id)
      ) {
        const poleIds = body.pole_relation_client_id
          .map((id: any) => parseInt(id))
          .filter((id: number) => !isNaN(id));
        if (poleIds.length > 0) {
          const poles = await this.poleRelationClientRepository.findBy({
            id: In(poleIds),
          });
          (savedStagiaire as any).poleRelationClients = poles;
          await queryRunner.manager.save(savedStagiaire);
        }
      }

      await queryRunner.commitTransaction();

      // Reload with relations
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error creating stagiaire:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stagiaire = await this.stagiaireRepository.findOne({
        where: { id },
        relations: ["user"],
      });

      if (!stagiaire) {
        throw new NotFoundException("Stagiaire non trouvé");
      }

      // Update User
      if (stagiaire.user) {
        if (body.name !== undefined) {
          stagiaire.user.name = body.name;
        }
        if (body.email !== undefined) {
          // Check if email is already used by another user
          const existingUser = await this.userRepository.findOne({
            where: { email: body.email },
          });
          if (existingUser && existingUser.id !== stagiaire.user.id) {
            throw new BadRequestException("Cet email est déjà utilisé");
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

      // Update Stagiaire fields
      if (body.civilite !== undefined) stagiaire.civilite = body.civilite;
      if (body.prenom !== undefined) stagiaire.prenom = body.prenom;
      if (body.telephone !== undefined) stagiaire.telephone = body.telephone;
      if (body.adresse !== undefined) stagiaire.adresse = body.adresse;
      if (body.ville !== undefined) stagiaire.ville = body.ville;
      if (body.code_postal !== undefined)
        stagiaire.code_postal = body.code_postal;
      if (body.date_naissance !== undefined)
        stagiaire.date_naissance = body.date_naissance;
      if (body.partenaire_id !== undefined)
        stagiaire.partenaire_id = body.partenaire_id || null;

      await queryRunner.manager.save(stagiaire);

      // Handle formations sync
      if (body.formations && typeof body.formations === "object") {
        // Delete existing relations
        await queryRunner.manager.delete(StagiaireCatalogueFormation, {
          stagiaire_id: id,
        });

        // Create new relations
        const formationsToSync: any[] = [];
        for (const [fid, vals] of Object.entries(body.formations)) {
          if (vals && typeof vals === "object" && (vals as any).selected) {
            formationsToSync.push({
              stagiaire_id: id,
              catalogue_formation_id: parseInt(fid),
              date_debut: (vals as any).date_debut || null,
              date_inscription: (vals as any).date_inscription || null,
              date_fin: (vals as any).date_fin || null,
              formateur_id: (vals as any).formateur_id || null,
            });
          }
        }
        if (formationsToSync.length > 0) {
          await queryRunner.manager.save(
            StagiaireCatalogueFormation,
            formationsToSync
          );
        }
      }

      // Handle commercials sync
      if (body.commercial_id !== undefined) {
        const commercialIds = Array.isArray(body.commercial_id)
          ? body.commercial_id
              .map((id: any) => parseInt(id))
              .filter((id: number) => !isNaN(id))
          : [];
        const commercials =
          commercialIds.length > 0
            ? await this.commercialRepository.findBy({
                id: In(commercialIds),
              })
            : [];
        stagiaire.commercials = commercials;
        await queryRunner.manager.save(stagiaire);
      }

      // Handle pole relation clients sync
      if (body.pole_relation_client_id !== undefined) {
        const poleIds = Array.isArray(body.pole_relation_client_id)
          ? body.pole_relation_client_id
              .map((id: any) => parseInt(id))
              .filter((id: number) => !isNaN(id))
          : [];
        const poles =
          poleIds.length > 0
            ? await this.poleRelationClientRepository.findBy({
                id: In(poleIds),
              })
            : [];
        stagiaire.poleRelationClients = poles;
        await queryRunner.manager.save(stagiaire);
      }

      await queryRunner.commitTransaction();

      // Reload with all relations
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error updating stagiaire:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({
      where: { id },
    });

    if (!stagiaire) {
      throw new NotFoundException("Stagiaire non trouvé");
    }

    await this.stagiaireRepository.delete(id);

    return this.apiResponse.success();
  }

  @Patch(":id/active")
  async active(@Param("id") id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({ where: { id } });
    if (!stagiaire) throw new NotFoundException("Stagiaire non trouvé");
    stagiaire.statut = "1";
    await this.stagiaireRepository.save(stagiaire);
    return this.apiResponse.success({ message: "Stagiaire activé" });
  }

  @Patch(":id/desactive")
  async desactive(@Param("id") id: number) {
    const stagiaire = await this.stagiaireRepository.findOne({ where: { id } });
    if (!stagiaire) throw new NotFoundException("Stagiaire non trouvé");
    stagiaire.statut = "0";
    await this.stagiaireRepository.save(stagiaire);
    return this.apiResponse.success({ message: "Stagiaire désactivé" });
  }
}
