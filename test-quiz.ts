import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";
import { QuizService } from "./src/quiz/quiz.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const quizService = app.get(QuizService);
  const result = await quizService.getQuizzesByFormation();

  let found = false;
  for (const f of result) {
    for (const q of f.quizzes) {
      for (const question of q.questions) {
        if (question.answers.length > 0) {
          console.log(
            `FOUND! Formation: ${f.titre}, Quiz: ${q.titre}, Question: ${question.text}`
          );
          console.log(`  Answers: ${JSON.stringify(question.answers)}`);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) break;
  }

  if (!found) {
    console.log("No questions with answers found in the entire result set!");
  }

  await app.close();
}
bootstrap();
