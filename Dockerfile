# Usando a versão mais recente do Node.js
FROM node:23-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar restante do código
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor a porta da API
EXPOSE 3000

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "run", "start"]
