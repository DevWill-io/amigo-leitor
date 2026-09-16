# 📚 Amigo Leitor

Sistema de **amigo secreto com livros**: cada participante cadastra até 5 livros que ama, e após o sorteio descobre quem irá presentear — escolhendo o livro ideal da lista da pessoa sorteada.

## ✨ Features

- 🔐 Login com Google (Firebase Auth)
- 👤 Edição de perfil (nome)
- 📖 Cadastro de até 5 livros (CRUD completo)
- 🔍 Busca por nome ou título de livro
- 🎲 Sorteio automático (área admin)
- 🌗 Tema claro/escuro
- 📱 Design responsivo e animações suaves

## 🧱 Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)
- React Hook Form + Zod
- Framer Motion
- React Hot Toast

## 🚀 Setup

### 1. Clone e instale

```bash
git clone <seu-repo>
cd amigo-leitor
npm install
```

### 2. Crie o projeto no Firebase

1. Acesse https://console.firebase.google.com
2. Crie um projeto
3. Ative **Authentication → Google**
4. Crie um **Firestore Database** (modo produção)
5. Em **Configurações do Projeto → Web App**, copie as chaves

### 3. Configure `.env.local`

Copie `.env.example` para `.env.local` e preencha com as chaves do Firebase.

Defina também `NEXT_PUBLIC_ADMIN_UID` com o UID do primeiro usuário que logar (o painel `/admin` só aparece para ele).

### 4. Publique as regras do Firestore

```bash
firebase deploy --only firestore:rules
```

Ou cole o conteúdo de `firestore.rules` direto no console.

### 5. Rode

```bash
npm run dev
```

Acesse http://localhost:3000

## 🗂 Estrutura

- `src/app` — páginas (App Router)
- `src/components` — componentes reutilizáveis
- `src/contexts` — Auth e Theme
- `src/lib` — Firebase + Firestore helpers
- `src/schemas` — Validação com Zod
- `src/types` — Tipos TypeScript

## 🎯 Fluxo

1. Usuário entra com Google
2. Cadastra nome + até 5 livros em `/perfil`
3. Todos veem os participantes na home `/`
4. Admin realiza o sorteio em `/admin`
5. Cada usuário vê seu amigo em `/amigo` e escolhe o livro

## 📄 Licença

MIT