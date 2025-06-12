# Etapa 1: Build da aplicação React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copie a configuração personalizada do Nginx para o local correto
# Se você quiser usar o arquivo 'nginx-k8s.conf' ou 'nginx.conf' da pasta 'frontend',
# precisaremos copiá-lo para a pasta 'f1-react-web' primeiro, ou ajustar o Deployment.
# Por enquanto, usaremos a configuração do ConfigMap que você já tem no K8s.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]