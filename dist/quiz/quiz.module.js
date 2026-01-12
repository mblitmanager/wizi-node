"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_module_1 = require("../common/common.module");
const api_response_service_1 = require("../common/services/api-response.service");
const quiz_entity_1 = require("../entities/quiz.entity");
const question_entity_1 = require("../entities/question.entity");
const reponse_entity_1 = require("../entities/reponse.entity");
const formation_entity_1 = require("../entities/formation.entity");
const classement_entity_1 = require("../entities/classement.entity");
const quiz_participation_entity_1 = require("../entities/quiz-participation.entity");
const quiz_participation_answer_entity_1 = require("../entities/quiz-participation-answer.entity");
const quiz_service_1 = require("./quiz.service");
const quiz_api_controller_1 = require("./quiz-api.controller");
const quizzes_api_controller_1 = require("./quizzes-api.controller");
const ranking_module_1 = require("../ranking/ranking.module");
let QuizModule = class QuizModule {
};
exports.QuizModule = QuizModule;
exports.QuizModule = QuizModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forFeature([
                quiz_entity_1.Quiz,
                question_entity_1.Question,
                reponse_entity_1.Reponse,
                formation_entity_1.Formation,
                classement_entity_1.Classement,
                quiz_participation_entity_1.QuizParticipation,
                quiz_participation_answer_entity_1.QuizParticipationAnswer,
            ]),
            ranking_module_1.RankingModule,
        ],
        controllers: [quiz_api_controller_1.QuizApiController, quizzes_api_controller_1.QuizzesApiController],
        providers: [quiz_service_1.QuizService, api_response_service_1.ApiResponseService],
        exports: [quiz_service_1.QuizService],
    })
], QuizModule);
//# sourceMappingURL=quiz.module.js.map