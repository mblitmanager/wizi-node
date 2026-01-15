FROM node:20-alpine AS builder

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci

# Copier les fichiers de configuration et le code source
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
COPY public ./public

# Build du projet NestJS
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Installer uniquement les dépendances nécessaires en prod
COPY package*.json ./
RUN npm ci --omit=dev

# Copier les assets buildés
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]

