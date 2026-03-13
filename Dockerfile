# --- ÉTAPE 1 : Build (Node.js) ---
FROM node:20-alpine AS build
WORKDIR /app

# Optimisation du cache pour les dépendances npm
COPY package*.json ./
RUN npm install

# Copie de tout le code source
COPY . .

# Compilation de l'application
# Le dossier 'dist/angular-codegen-lab/browser' sera généré ici
RUN npm run build --configuration=production

# --- ÉTAPE 2 : Runtime (Serveur Web Nginx) ---
FROM nginx:stable-alpine

# On vide le dossier par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers compilés depuis l'étape de build (Ton arborescence validée)
COPY --from=build /app/dist/angular-codegen-lab/browser /usr/share/nginx/html

# Exposition du port standard HTTP
EXPOSE 80

# Lancement de Nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
