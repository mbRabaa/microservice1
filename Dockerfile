FROM node:20-alpine

WORKDIR /app

# 1. Copie séparée des fichiers de dépendances d'abord
COPY package*.json ./
RUN npm install --production && \
    npm cache clean --force

# 2. Ne copiez PAS le .env (important!)
COPY src/ src/

# 3. Variables d'environnement nécessaires pour le build
ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

# 4. Utilisation de node avec inspect pour le debug
CMD ["node", "--inspect=0.0.0.0:9229", "src/backend/server.js"]