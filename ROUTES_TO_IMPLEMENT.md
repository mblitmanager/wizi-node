# Routes à implémenter dans Wizi-learn-node

## Status: À mettre à jour depuis Laravel

Voici les routes présentes dans Laravel qui doivent être dupliquées/mises à jour dans Node.js:

### 1. QUESTIONS API (Manquantes)
```
GET    /api/questions                                    - Récupérer toutes les questions
POST   /api/questions                                    - Créer une question
GET    /api/questions/{id}                               - Détails d'une question
PATCH  /api/questions/{id}                               - Modifier une question
DELETE /api/questions/{id}                               - Supprimer une question
GET    /api/questions/{questionId}/reponses              - Récupérer les réponses d'une question
```

**Controller à créer:** `src/quiz/questions-api.controller.ts`

### 2. REPONSES API (Manquantes)
```
GET    /api/reponses                                     - Récupérer toutes les réponses
POST   /api/reponses                                     - Créer une réponse
GET    /api/reponses/{id}                                - Détails d'une réponse
PATCH  /api/reponses/{id}                                - Modifier une réponse
DELETE /api/reponses/{id}                                - Supprimer une réponse
```

**Controller à créer:** `src/quiz/reponses-api.controller.ts`

### 3. AUTH - REFRESH TOKEN (À vérifier/mettre à jour)
```
POST   /api/refresh                                      - Rafraîchir le token (EXISTE)
POST   /api/refresh-token                                - Alternative de rafraîchissement (À ajouter)
```

**Controller:** `src/auth/auth.controller.ts` - Ajouter la route `refresh-token`

### 4. QUIZ API (À valider - plupart existent)

Ces routes existent déjà partiellement:
```
GET    /api/quiz/by-formations                           ✓ EXISTE
GET    /api/quiz/categories                              ✓ EXISTE
GET    /api/quiz/category/{categoryId}                   ✓ EXISTE
GET    /api/quiz/classement/global                       ✓ EXISTE
GET    /api/quiz/history                                 ✓ EXISTE
GET    /api/quiz/stats                                   ✓ EXISTE
GET    /api/quiz/stats/categories                        ✓ EXISTE
GET    /api/quiz/stats/performance                       ✓ EXISTE
GET    /api/quiz/stats/progress                          ✓ EXISTE
GET    /api/quiz/stats/trends                            ✓ EXISTE
GET    /api/quiz/{id}                                    ✓ EXISTE
POST   /api/quiz/{id}/result                             ✓ EXISTE
POST   /api/quiz/{quizId}/complete                       ✓ EXISTE
GET    /api/quiz/{quizId}/participation                  ✓ EXISTE
POST   /api/quiz/{quizId}/participation                  ✓ EXISTE
POST   /api/quiz/{quizId}/participation/progress         ✓ EXISTE
GET    /api/quiz/{quizId}/participation/resume           ✓ EXISTE
GET    /api/quiz/{quizId}/questions                      ✓ EXISTE
GET    /api/quiz/{quizId}/statistics                     ✓ EXISTE
POST   /api/quiz/{quizId}/submit                         ✓ EXISTE
GET    /api/quiz/{quizId}/user-participations            ✓ EXISTE
```

### 5. QUIZZES API (À valider)

ApiPlatform routes (JSON-LD format):
```
GET    /api/quizzes                                      - Collection de quizzes
POST   /api/quizzes                                      - Créer un quiz
GET    /api/quizzes/{id}                                 - Détails d'un quiz
PATCH  /api/quizzes/{id}                                 - Modifier un quiz
DELETE /api/quizzes/{id}                                 - Supprimer un quiz
POST   /api/quizzes/{quizId}/submit                      ✓ EXISTE
```

**Fichier:** `src/quiz/quizzes-api.controller.ts`

## Actions à effectuer:

1. **Créer QuestionsApiController** avec les 6 routes CRUD manquantes
2. **Créer ReponseApiController** avec les 5 routes CRUD manquantes  
3. **Ajouter refresh-token** dans AuthController
4. **Mettre à jour QuizzesApiController** si manquant ou incomplet
5. **Valider les formats de réponse** pour correspondre à Laravel (ApiPlatform JSON-LD)

## Format de réponse attendu (ApiPlatform):

```json
{
  "@context": "/api/contexts/...",
  "@id": "/api/questions/123",
  "@type": "Question",
  "id": 123,
  "texte": "...",
  "quiz": "/api/quizzes/456",
  "reponses": ["/api/reponses/1", "/api/reponses/2"],
  "created_at": "2024-01-12T00:00:00Z"
}
```

## Priorité:
1. **HIGH:** Questions et Reponses API (bloquant pour les quizzes)
2. **MEDIUM:** Refresh-token endpoint
3. **LOW:** Valider/optimiser les réponses JSON-LD
