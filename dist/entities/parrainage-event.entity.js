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
exports.ParrainageEvent = void 0;
const typeorm_1 = require("typeorm");
let ParrainageEvent = class ParrainageEvent {
};
exports.ParrainageEvent = ParrainageEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ParrainageEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ParrainageEvent.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ParrainageEvent.prototype, "prix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], ParrainageEvent.prototype, "date_debut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], ParrainageEvent.prototype, "date_fin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ParrainageEvent.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ParrainageEvent.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["active", "inactive"], default: "active" }),
    __metadata("design:type", String)
], ParrainageEvent.prototype, "status", void 0);
exports.ParrainageEvent = ParrainageEvent = __decorate([
    (0, typeorm_1.Entity)("parrainage_events")
], ParrainageEvent);
//# sourceMappingURL=parrainage-event.entity.js.map