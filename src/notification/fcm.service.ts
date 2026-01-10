import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

@Injectable()
export class FcmService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>("FIREBASE_PROJECT_ID");
    const clientEmail = this.configService.get<string>("FIREBASE_CLIENT_EMAIL");
    let privateKey = this.configService.get<string>("FIREBASE_PRIVATE_KEY");
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
      } else {
        this.firebaseApp = admin.app();
      }
    } else {
      console.warn(
        "Firebase credentials missing in environment variables. FCM notifications will be disabled."
      );
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data: any = {}
  ) {
    if (!this.firebaseApp) {
      console.warn("Firebase not initialized. Cannot send push notification.");
      return false;
    }

    if (!token) {
      return false;
    }

    // Ensure all data values are strings for FCM
    const stringData = Object.keys(data).reduce((acc, key) => {
      acc[key] = String(data[key]);
      return acc;
    }, {});

    const message: admin.messaging.Message = {
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
          link: this.configService.get<string>("APP_URL") || "/",
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent push notification:", response);
      return true;
    } catch (error) {
      console.error("Error sending push notification:", error);
      return false;
    }
  }
}
