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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classement_entity_1 = require("../entities/classement.entity");
const stagiaire_entity_1 = require("../entities/stagiaire.entity");
let RankingService = class RankingService {
    constructor(classementRepository, stagiaireRepository) {
        this.classementRepository = classementRepository;
        this.stagiaireRepository = stagiaireRepository;
    }
    async getGlobalRanking() {
        const allClassements = await this.classementRepository.find({
            relations: [
                "stagiaire",
                "stagiaire.user",
                "quiz",
                "stagiaire.formateurs",
                "stagiaire.formateurs.user",
            ],
        });
        const groupedByStagiaire = this.groupBy(allClassements, "stagiaire_id");
        const ranking = Object.keys(groupedByStagiaire).map((stagiaireId) => {
            const group = groupedByStagiaire[stagiaireId];
            const totalPoints = group.reduce((sum, item) => sum + (item.points || 0), 0);
            const first = group[0];
            const stagiaire = first.stagiaire;
            const [fName, ...lParts] = (stagiaire.user?.name || "").split(" ");
            const lastName = lParts.join(" ") || "";
            return {
                id: stagiaire.id,
                firstname: stagiaire.prenom || fName || "Anonyme",
                lastname: lastName,
                name: lastName,
                image: stagiaire.user?.image || null,
                score: totalPoints,
                totalPoints,
                quizCount: group.length,
                completedQuizzes: group.length,
                averageScore: totalPoints / group.length,
                formateurs: (stagiaire.formateurs || []).map((f) => ({
                    id: f.id,
                    prenom: f.prenom || "",
                    nom: f.nom || f.user?.name?.split(" ").slice(1).join(" ") || "",
                    image: f.user?.image || null,
                })),
            };
        });
        ranking.sort((a, b) => b.totalPoints - a.totalPoints);
        return ranking.map((item, index) => ({
            ...item,
            rang: index + 1,
            level: this.calculateLevel(item.totalPoints),
        }));
    }
    async getMyRanking(userId) {
        const globalRanking = await this.getGlobalRanking();
        const stagiaire = await this.stagiaireRepository.findOne({
            where: { user_id: userId },
            relations: ["user"],
        });
        if (!stagiaire) {
            throw new Error("Stagiaire not found");
        }
        const myRanking = globalRanking.find((item) => item.id === stagiaire.id);
        if (!myRanking) {
            const [fName, ...lParts] = (stagiaire.user?.name || "").split(" ");
            const lastName = lParts.join(" ") || "";
            return {
                id: stagiaire.id,
                firstname: stagiaire.prenom || fName || "Anonyme",
                lastname: lastName,
                name: lastName,
                image: stagiaire.user?.image || null,
                score: 0,
                totalPoints: 0,
                quizCount: 0,
                completedQuizzes: 0,
                averageScore: 0,
                rang: globalRanking.length + 1,
                level: "0",
                formateurs: [],
            };
        }
        return myRanking;
    }
    calculateLevel(points) {
        const basePoints = 10;
        const maxLevel = 100;
        let level = "0";
        for (let l = 0; l <= maxLevel; l++) {
            const threshold = (l - 1) * basePoints;
            if (points >= threshold) {
                level = l.toString();
            }
            else {
                break;
            }
        }
        return level;
    }
    groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classement_entity_1.Classement)),
    __param(1, (0, typeorm_1.InjectRepository)(stagiaire_entity_1.Stagiaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RankingService);
//# sourceMappingURL=ranking.service.js.map