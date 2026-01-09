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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return {
            name: "Wizi-Learn API",
            version: "1.0.0",
            status: "UP",
            documentation: "/api/docs",
            message: "Bienvenue sur l'API de Wizi-Learn. Utilisez le préfixe /api pour accéder aux ressources.",
        };
    }
    getAdminInterface() {
        return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wizi-Learn - Interface Administrateur</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { background: #0f0f0f; color: #d4af37; font-family: 'Inter', sans-serif; }
              .card { background: #1a1a1a; border: 1px solid #d4af37; color: #fff; }
              .btn-gold { background: #d4af37; color: #000; font-weight: bold; border: none; }
              .btn-gold:hover { background: #b8860b; color: #fff; }
              .navbar { border-bottom: 2px solid #d4af37; }
              .status-badge { background: #28a745; color: #fff; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; }
          </style>
      </head>
      <body>
          <nav class="navbar navbar-dark bg-dark">
              <div class="container">
                  <span class="navbar-brand mb-0 h1 text-gold">Wizi-Learn Admin</span>
                  <span class="status-badge">Serveur Opérationnel</span>
              </div>
          </nav>

          <div class="container mt-5">
              <div class="row">
                  <div class="col-md-12 text-center mb-5">
                      <h1 class="display-4">Tableau de Bord Administrateur</h1>
                      <p class="lead">Bienvenue sur le clone Node.js de l'interface Wizi-Learn.</p>
                  </div>
              </div>

              <div class="row g-4">
                  <div class="col-md-4">
                      <div class="card h-100 p-4">
                          <h3>Documentation API</h3>
                          <p>Consultez et testez tous les points de terminaison de l'API via Swagger.</p>
                          <a href="/api/docs" class="btn btn-gold mt-auto">Ouvrir Swagger</a>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="card h-100 p-4">
                          <h3>Gestion des Ressources</h3>
                          <ul class="list-unstyled">
                              <li>• Stagiaires: <code>/api/admin/stagiaires</code></li>
                              <li>• Formateurs: <code>/api/admin/formateurs</code></li>
                              <li>• Quizzes: <code>/api/admin/quizzes</code></li>
                              <li>• Formations: <code>/api/admin/formations</code></li>
                          </ul>
                          <p class="small text-muted">Utilisez un jeton JWT valide pour accéder à ces routes.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="card h-100 p-4">
                          <h3>Statistiques Globales</h3>
                          <p>Visualisez l'activité du système en temps réel.</p>
                          <a href="/api/admin/stats/dashboard" class="btn btn-outline-warning mt-auto">Voir Stats (JSON)</a>
                      </div>
                  </div>
              </div>

              <footer class="mt-5 pt-5 text-center text-muted border-top border-dark">
                  <p>&copy; 2026 Wizi-Learn Node.js Backend Clone. Conçu pour la performance.</p>
              </footer>
          </div>
      </body>
      </html>
    `;
    }
    getAdminRedirect() {
        return this.getAdminInterface();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("administrateur"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAdminInterface", null);
__decorate([
    (0, common_1.Get)("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAdminRedirect", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map