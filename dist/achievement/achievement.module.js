"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const achievement_service_1 = require("./achievement.service");
const achievement_controller_1 = require("./achievement.controller");
const achievement_entity_1 = require("../entities/achievement.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
const stagiaire_achievement_entity_1 = require("../entities/stagiaire-achievement.entity");
const progression_entity_1 = require("../entities/progression.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const media_stagiaire_entity_1 = require("../entities/media-stagiaire.entity");
const media_entity_1 = require("../entities/media.entity");
const parrainage_entity_1 = require("../entities/parrainage.entity");
let AchievementModule = class AchievementModule {
};
exports.AchievementModule = AchievementModule;
exports.AchievementModule = AchievementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                achievement_entity_1.Achievement,
                stagiaire_entity_1.Stagiaire,
                stagiaire_achievement_entity_1.StagiaireAchievement,
                progression_entity_1.Progression,
                quiz_entity_1.Quiz,
                media_stagiaire_entity_1.MediaStagiaire,
                media_entity_1.Media,
                parrainage_entity_1.Parrainage,
            ]),
        ],
        providers: [achievement_service_1.AchievementService],
        controllers: [achievement_controller_1.AchievementController],
        exports: [achievement_service_1.AchievementService],
    })
], AchievementModule);
//# sourceMappingURL=achievement.module.js.map