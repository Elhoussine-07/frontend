# Build stage
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --include=dev

COPY . .

ARG VITE_GATEWAY_URL=http://localhost:8080
ARG VITE_NOTIFICATIONS_URL=http://localhost:8085
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL
ENV VITE_NOTIFICATIONS_URL=$VITE_NOTIFICATIONS_URL

ENV NITRO_PRESET=node-server
RUN npm run build

# Runtime avec Node.js
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copier le build complet
COPY --from=build /app/.output ./.output

# Vérifier les fichiers
RUN ls -la .output/
RUN ls -la .output/server/
RUN ls -la .output/public/

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
