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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizParticipation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const quiz_entity_1 = require("./quiz.entity");
const quiz_participation_answer_entity_1 = require("./quiz-participation-answer.entity");
let QuizParticipation = class QuizParticipation {
};
exports.QuizParticipation = QuizParticipation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], QuizParticipation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "quiz_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_1.Quiz),
    (0, typeorm_1.JoinColumn)({ name: "quiz_id" }),
    __metadata("design:type", quiz_entity_1.Quiz)
], QuizParticipation.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuizParticipation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], QuizParticipation.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], QuizParticipation.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "correct_answers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "time_spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuizParticipation.prototype, "current_question_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quiz_participation_answer_entity_1.QuizParticipationAnswer, (answer) => answer.participation),
    __metadata("design:type", Array)
], QuizParticipation.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], QuizParticipation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], QuizParticipation.prototype, "updated_at", void 0);
exports.QuizParticipation = QuizParticipation = __decorate([
    (0, typeorm_1.Entity)("quiz_participations")
], QuizParticipation);
//# sourceMappingURL=quiz-participation.entity.js.map