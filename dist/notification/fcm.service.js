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
exports.FcmService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
let FcmService = class FcmService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const projectId = this.configService.get("FIREBASE_PROJECT_ID");
        const clientEmail = this.configService.get("FIREBASE_CLIENT_EMAIL");
        let privateKey = this.configService.get("FIREBASE_PRIVATE_KEY");
        if (privateKey) {
            privateKey = privateKey.replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n");
        }
        if (projectId && clientEmail && privateKey) {
            if (!admin.apps.length) {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
                console.log("Firebase Admin SDK initialized successfully");
            }
            else {
                this.firebaseApp = admin.app();
            }
        }
        else {
            console.warn("Firebase credentials missing in environment variables. FCM notifications will be disabled.");
        }
    }
    async sendPushNotification(token, title, body, data = {}) {
        if (!this.firebaseApp) {
            console.warn("Firebase not initialized. Cannot send push notification.");
            return false;
        }
        if (!token) {
            return false;
        }
        const stringData = Object.keys(data).reduce((acc, key) => {
            acc[key] = String(data[key]);
            return acc;
        }, {});
        const message = {
            token,
            notification: {
                title,
                body,
            },
            data: stringData,
            android: {
                notification: {
                    clickAction: "FLUTTER_NOTIFICATION_CLICK",
                },
            },
            apns: {
                payload: {
                    aps: {
                        badge: 1,
                        sound: "default",
                    },
                },
            },
            webpush: {
                fcmOptions: {
                    link: this.configService.get("APP_URL") || "/",
                },
            },
        };
        try {
            const response = await admin.messaging().send(message);
            console.log("Successfully sent push notification:", response);
            return true;
        }
        catch (error) {
            console.error("Error sending push notification:", error);
            return false;
        }
    }
};
exports.FcmService = FcmService;
exports.FcmService = FcmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FcmService);
//# sourceMappingURL=fcm.service.js.map