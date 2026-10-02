# ---- Stage 1: build the Angular app ----
FROM public.ecr.aws/docker/library/node:22-alpine AS build
WORKDIR /app

RUN npm install -g npm@11.21.0

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG BUILD_ID=local
RUN sed -i "s/buildId: '.*'/buildId: '${BUILD_ID}'/" src/environments/environment.ts \
 && npm run build

# ---- Stage 2: serve with nginx ----
FROM public.ecr.aws/docker/library/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/cicd-mobile/browser /usr/share/nginx/html
EXPOSE 80
