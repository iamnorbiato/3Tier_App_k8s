# G:\Learning\3Tier_App_K8s\backend\Dockerfile
# Use uma imagem base Node.js adequada
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app 

# Copia package.json e package-lock.json (se houver)
COPY package*.json ./ 
# Instala as dependências de produção
RUN npm install --production 

# <--- ESTA LINHA É CRÍTICA! Copia todo o código-fonte do diretório atual (backend) para /app
COPY . . 

# Porta que seu aplicativo Node.js escuta
EXPOSE 5000 

# Comando para iniciar seu app. Se você usa nodemon, certifique-se de que ele está configurado corretamente para o ambiente de container.
CMD ["npm", "start"]