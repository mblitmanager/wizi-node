"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParrainageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const parrainage_service_1 = require("./parrainage.service");
const parrainage_controller_1 = require("./parrainage.controller");
const parrainage_entity_1 = require("../entities/parrainage.entity");
const parrainage_token_entity_1 = require("../entities/parrainage-token.entity");
const parrainage_event_entity_1 = require("../entities/parrainage-event.entity");
const user_entity_1 = require("../entities/user.entity");
let ParrainageModule = class ParrainageModule {
};
exports.ParrainageModule = ParrainageModule;
exports.ParrainageModule = ParrainageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                parrainage_entity_1.Parrainage,
                parrainage_token_entity_1.ParrainageToken,
                parrainage_event_entity_1.ParrainageEvent,
                user_entity_1.User,
            ]),
        ],
        providers: [parrainage_service_1.ParrainageService],
        controllers: [parrainage_controller_1.ParrainageController],
        exports: [parrainage_service_1.ParrainageService],
    })
], ParrainageModule);
//# sourceMappingURL=parrainage.module.js.map