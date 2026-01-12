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
exports.DocsLdController = exports.DocsController = void 0;
const common_1 = require("@nestjs/common");
let DocsController = class DocsController {
    async getRootContext(req) {
        const protocol = req.protocol;
        const host = req.get("host");
        const baseUrl = `${protocol}://${host}`;
        return {
            "@context": {
                "@vocab": `${baseUrl}/api/docs.jsonld#`,
                hydra: "http://www.w3.org/ns/hydra/core#",
                error: {
                    "@id": "Entrypoint/error",
                    "@type": "@id",
                },
                validationError: {
                    "@id": "Entrypoint/validationError",
                    "@type": "@id",
                },
                agenda: {
                    "@id": "Entrypoint/agenda",
                    "@type": "@id",
                },
                catalogueFormation: {
                    "@id": "Entrypoint/catalogueFormation",
                    "@type": "@id",
                },
                challenge: {
                    "@id": "Entrypoint/challenge",
                    "@type": "@id",
                },
                classement: {
                    "@id": "Entrypoint/classement",
                    "@type": "@id",
                },
                commercial: {
                    "@id": "Entrypoint/commercial",
                    "@type": "@id",
                },
                formateur: {
                    "@id": "Entrypoint/formateur",
                    "@type": "@id",
                },
                formation: {
                    "@id": "Entrypoint/formation",
                    "@type": "@id",
                },
                media: {
                    "@id": "Entrypoint/media",
                    "@type": "@id",
                },
                participation: {
                    "@id": "Entrypoint/participation",
                    "@type": "@id",
                },
                poleRelationClient: {
                    "@id": "Entrypoint/poleRelationClient",
                    "@type": "@id",
                },
                progression: {
                    "@id": "Entrypoint/progression",
                    "@type": "@id",
                },
                questions: {
                    "@id": "Entrypoint/questions",
                    "@type": "@id",
                },
                quiz: {
                    "@id": "Entrypoint/quiz",
                    "@type": "@id",
                },
                reponse: {
                    "@id": "Entrypoint/reponse",
                    "@type": "@id",
                },
                stagiaire: {
                    "@id": "Entrypoint/stagiaire",
                    "@type": "@id",
                },
                user: {
                    "@id": "Entrypoint/user",
                    "@type": "@id",
                },
            },
        };
    }
    async getResourceContext(resource, req) {
        const protocol = req.protocol;
        const host = req.get("host");
        const baseUrl = `${protocol}://${host}`;
        return {
            "@context": {
                "@vocab": `${baseUrl}/api/docs.jsonld#`,
                hydra: "http://www.w3.org/ns/hydra/core#",
                "@id": resource,
            },
        };
    }
};
exports.DocsController = DocsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "getRootContext", null);
__decorate([
    (0, common_1.Get)(":resource"),
    __param(0, (0, common_1.Param)("resource")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "getResourceContext", null);
exports.DocsController = DocsController = __decorate([
    (0, common_1.Controller)("contexts")
], DocsController);
let DocsLdController = class DocsLdController {
    async getDocsLd(req) {
        return {
            "@context": {
                hydra: "http://www.w3.org/ns/hydra/core#",
                rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                xmls: "http://www.w3.org/2001/XMLSchema#",
                owl: "http://www.w3.org/2002/07/owl#",
                schema: "http://schema.org/",
                domain: { "@id": "rdfs:domain", "@type": "@id" },
                range: { "@id": "rdfs:range", "@type": "@id" },
                subClassOf, ": { ": , ": ": rdfs, subClassOf, ", ": , ": ": , " },: expects
            }
        };
        {
            "@id";
            "hydra:expects", "@type";
            "@id";
        }
        returns: {
            "@id";
            "hydra:returns", "@type";
            "@id";
        }
    }
};
exports.DocsLdController = DocsLdController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocsLdController.prototype, "getDocsLd", null);
exports.DocsLdController = DocsLdController = __decorate([
    (0, common_1.Controller)("docs.jsonld")
], DocsLdController);
;
//# sourceMappingURL=docs.controller.js.map