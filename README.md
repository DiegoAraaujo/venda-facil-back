# 🚀 Venda Fácil – Backend

O **Venda Fácil – Backend** é a API responsável por toda a lógica da aplicação.
Ela gerencia autenticação, lojas, produtos, pedidos, avaliações e upload de imagens.

A arquitetura foi desenvolvida seguindo boas práticas de organização, segurança e escalabilidade utilizando Node.js e padrão REST.

## 🛠 Tecnologias Utilizadas

* Node.js
* Express
* PostgreSQL
* AWS S3
* JWT (Access Token + Refresh Token)
* Bcrypt (hash de senhas)
* Joi (validação de dados)
* Cookie Parser
* CORS

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

# AWS S3 (armazenamento de imagens)
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

# Servidor
PORT=3000

# JWT
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=10m
```
---

## ▶️ Rodando o Projeto Localmente

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Iniciar o servidor

```bash
npm run dev
```

ou

```bash
npm start
```

Servidor disponível em:

```
http://localhost:3000
```

## 📌 Funcionalidades da API

* Autenticação com JWT (Access Token + Refresh Token)
* Hash seguro de senhas com Bcrypt
* Validação de dados com Joi
* Cadastro e login de lojistas
* CRUD de lojas
* CRUD de produtos
* Upload de imagens para AWS S3
* Carrinho de compras
* Gestão de pedidos
* Sistema de avaliações
* Organização por categorias

## 🔐 Segurança

* Senhas criptografadas com Bcrypt
* Tokens JWT com tempo de expiração configurável
* Validação de entrada com Joi
* Variáveis sensíveis protegidas por ambiente
