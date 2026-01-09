"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./entities/user.entity");
const stagiaire_entity_1 = require("./entities/stagiaire.entity");
const formation_entity_1 = require("./entities/formation.entity");
const catalogue_formation_entity_1 = require("./entities/catalogue-formation.entity");
const quiz_entity_1 = require("./entities/quiz.entity");
const question_entity_1 = require("./entities/question.entity");
const reponse_entity_1 = require("./entities/reponse.entity");
const auth_module_1 = require("./auth/auth.module");
const stagiaire_module_1 = require("./stagiaire/stagiaire.module");
const formation_module_1 = require("./formation/formation.module");
const quiz_module_1 = require("./quiz/quiz.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: "mysql",
                    url: configService.get("DATABASE_URL"),
                    entities: [
                        user_entity_1.User,
                        stagiaire_entity_1.Stagiaire,
                        formation_entity_1.Formation,
                        catalogue_formation_entity_1.CatalogueFormation,
                        quiz_entity_1.Quiz,
                        question_entity_1.Question,
                        reponse_entity_1.Reponse,
                    ],
                    synchronize: false,
                    logging: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                stagiaire_entity_1.Stagiaire,
                formation_entity_1.Formation,
                catalogue_formation_entity_1.CatalogueFormation,
                quiz_entity_1.Quiz,
                question_entity_1.Question,
                reponse_entity_1.Reponse,
            ]),
            auth_module_1.AuthModule,
            stagiaire_module_1.StagiaireModule,
            formation_module_1.FormationModule,
            quiz_module_1.QuizModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map