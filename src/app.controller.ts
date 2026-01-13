import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { FcmService } from "./notification/fcm.service";
import { MailService } from "./mail/mail.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fcmService: FcmService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Get("test-mail")
  async testMail(@Query("to") to: string) {
    if (!to) return { error: "Provide 'to' query parameter" };
    try {
      await this.mailService.sendPlainTextMail(
        to,
        "Test SMTP - Wizi Learn",
        "Ceci est un mail de test pour vérifier la configuration SMTP de l'API Node.js."
      );
      return { success: true, message: `Email sent to ${to}` };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @Post("test-fcm")
  async testFcm(@Body() body: any) {
    const { title, body: msgBody, data, token, user_id } = body;
    return this.handleFcmRequest(title, msgBody, data, token, user_id);
  }

  @Get("test-fcm")
  async testFcmGet(@Query() query: any) {
    const { title, body: msgBody, data, token, user_id } = query;
    return this.handleFcmRequest(title, msgBody, data, token, user_id);
  }

  private async handleFcmRequest(
    title: string,
    msgBody: string,
    data: any,
    token: string,
    user_id: any
  ) {
    // Basic validation matching Laravel
    if (!title || !msgBody) {
      // Only enforce Validation if not just testing connectivity
      // If empty, providing defaults for GET convenience if needed,
      // but for parity we might want to error or defaults.
      // Let's use defaults for GET convenience if missing
      if (!title) title = "Test Notification";
      if (!msgBody) msgBody = "This is a test message from GET request";
    }

    if (token) {
      const sent = await this.fcmService.sendPushNotification(
        token,
        title,
        msgBody,
        data || {}
      );
      return { ok: sent };
    }

    if (user_id) {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        return { error: "User not found" };
      }
      const sent = await this.fcmService.sendPushNotification(
        user.fcm_token,
        title,
        msgBody,
        data || {}
      );
      return { ok: sent };
    }

    return { error: "Provide token or user_id" };
  }

  @Get("test-notif")
  getTestNotif() {
    // TODO: Implement real-time event broadcasting (websocket/gateway)
    // Matches Laravel: return 'Notification envoyée !';
    return "Notification envoyée !";
  }

  @Get()
  getHello() {
    return {
      name: "Wizi-Learn API",
      version: "1.0.0",
      status: "UP",
      documentation: "/api/docs",
      message:
        "Bienvenue sur l'API de Wizi-Learn. Utilisez le préfixe /api pour accéder aux ressources.",
    };
  }

  @Get("administrateur")
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

  @Get("admin")
  getAdminRedirect() {
    return this.getAdminInterface();
  }
}
