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
exports.UserAchievement = void 0;
const typeorm_1 = require("typeorm");
const stagiaire_entity_1 = require("./stagiaire.entity");
const achievement_entity_1 = require("./achievement.entity");
let UserAchievement = class UserAchievement {
};
exports.UserAchievement = UserAchievement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAchievement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserAchievement.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserAchievement.prototype, "achievement_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserAchievement.prototype, "unlocked_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserAchievement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserAchievement.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stagiaire_entity_1.Stagiaire),
    (0, typeorm_1.JoinColumn)({ name: "user_id", referencedColumnName: "user_id" }),
    __metadata("design:type", stagiaire_entity_1.Stagiaire)
], UserAchievement.prototype, "stagiaire", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => achievement_entity_1.Achievement),
    (0, typeorm_1.JoinColumn)({ name: "achievement_id" }),
    __metadata("design:type", achievement_entity_1.Achievement)
], UserAchievement.prototype, "achievement", void 0);
exports.UserAchievement = UserAchievement = __decorate([
    (0, typeorm_1.Entity)("user_achievements")
], UserAchievement);
//# sourceMappingURL=user-achievement.entity.js.map