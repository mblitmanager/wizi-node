import * as bcrypt from "bcrypt";
import { createConnection } from "typeorm";
import { User } from "./src/entities/user.entity";
import { Stagiaire } from "./src/entities/stagiaire.entity";
import { Formateur } from "./src/entities/formateur.entity";
import { Partenaire } from "./src/entities/partenaire.entity";
import { CatalogueFormation } from "./src/entities/catalogue-formation.entity";
import { Formation } from "./src/entities/formation.entity";
import { CatalogueFormationStagiaire } from "./src/entities/catalogue-formation-stagiaire.entity";
import { FormateurStagiaire } from "./src/entities/formateur-stagiaire.entity";
import { Media } from "./src/entities/media.entity";
import { MediaStagiaire } from "./src/entities/media-stagiaire.entity";
import { Quiz } from "./src/entities/quiz.entity";
import { Question } from "./src/entities/question.entity";
import { Reponse } from "./src/entities/reponse.entity";
import { QuizParticipation } from "./src/entities/quiz-participation.entity";
import { QuizReponse } from "./src/entities/quiz-reponse.entity";
import { Role } from "./src/entities/role.entity";
import { Permission } from "./src/entities/permission.entity";
import { RolePermission } from "./src/entities/role-permission.entity";
import { UserPro } from "./src/entities/user-pro.entity";

async function test() {
  try {
    const connection = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "wizi",
      password: "Test1234",
      database: "tess",
      entities: [
        User,
        Stagiaire,
        Formateur,
        Partenaire,
        CatalogueFormation,
        Formation,
        CatalogueFormationStagiaire,
        FormateurStagiaire,
        Media,
        MediaStagiaire,
        Quiz,
        Question,
        Reponse,
        QuizParticipation,
        QuizReponse,
        Role,
        Permission,
        RolePermission,
        UserPro,
      ],
      synchronize: false,
    });

    const user = await connection
      .getRepository(User)
      .findOne({ where: { email: "herizo3812@gmail.com" } });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Hash from DB:", user.password);
    const pass = "Test1234";

    // Test standard comparison
    const match1 = await bcrypt.compare(pass, user.password);
    console.log("Standard compare:", match1);

    // Test with replacement
    const normalizedPassword = user.password.replace(/^\$2y\$/, "$2b$");
    console.log("Normalized hash:", normalizedPassword);
    const match2 = await bcrypt.compare(pass, normalizedPassword);
    console.log("Normalized compare:", match2);

    await connection.close();
  } catch (e) {
    console.error(e);
  }
}

test();
