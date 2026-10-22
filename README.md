# 🛍️ SABA MODEST — Modest Fashion Store

<p align="center">
  A modern, full-stack e-commerce platform for discovering and managing modest fashion products.
</p>

<p align="center">
  <a href="https://saba-modest-client.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Website-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/mdabdulawal2001/saba-modest-client">
    <img src="https://img.shields.io/badge/Frontend-GitHub-black?style=for-the-badge&logo=github" alt="Frontend Repository" />
  </a>
  <a href="https://github.com/mdabdulawal2001/saba-modest-server">
    <img src="https://img.shields.io/badge/Backend-GitHub-blue?style=for-the-badge&logo=github" alt="Backend Repository" />
  </a>
  <a href="https://saba-modest-server.onrender.com/">
    <img src="https://img.shields.io/badge/Backend_API-Live-success?style=for-the-badge&logo=render" alt="Backend API" />
  </a>
</p>

---

## 📸 Screenshot

<p align="center">
  <img width="682" height="420" alt="Screenshot 2026-10-23 022930" src="https://github.com/user-attachments/assets/bde45fa3-7a6e-4cd9-94a2-cbaffa68a316" />
</p>

---

## 📝 Project Overview

**SABA MODEST** is a modern, full-stack e-commerce platform designed for modest fashion shopping. It provides a user-friendly interface for exploring fashion products, viewing product details, and managing product listings.

The application uses a separate Next.js frontend and Express.js backend, with MongoDB for data storage and Better Auth for authentication.

## ✨ Key Features

- 🛍️ Browse modest fashion products.
- 🔎 Explore products by category.
- 👗 View product details.
- ➕ Add new products.
- 📝 Manage existing product listings.
- 🔐 User authentication with Better Auth.
- 🌐 Google authentication integration.
- 🗄️ MongoDB database integration.
- 📱 Responsive design for desktop, tablet, and mobile.
- 🎨 Modern UI with smooth animations.
- 🔔 User-friendly notifications and loading states.

## 🔗 Project Links

| Resource | Link |
|---|---|
| Live Website | [SABA MODEST](https://saba-modest-client.vercel.app/) |
| Frontend Repository | [GitHub](https://github.com/mdabdulawal2001/saba-modest-client) |
| Backend Repository | [GitHub](https://github.com/mdabdulawal2001/saba-modest-server) |
| Live Backend API | [Render](https://saba-modest-server.onrender.com/) |

## 🛠️ Technologies Used

**Frontend**
- Next.js
- React
- JavaScript
- Tailwind CSS
- HeroUI
- Framer Motion
- Better Auth

**Backend**
- Node.js
- Express.js
- MongoDB
- Better Auth
- dotenv

**Deployment**
- Vercel — Frontend
- Render — Backend API

---

## 🚀 Run Locally

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- A MongoDB database
- Google OAuth credentials for Google sign-in

### 1. Clone the Frontend

```bash
git clone https://github.com/mdabdulawal2001/saba-modest-client.git
cd saba-modest-client
npm install
```

### 2. Configure Frontend Environment Variables

Create a `.env.local` file in the frontend project root:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_BETTER_AUTH_URL=your_base_url
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the example values with your actual configuration. The API URL and Better Auth URL must match the local backend/authentication setup.

### 3. Start the Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Clone the Backend

Open a **separate terminal**:

```bash
git clone https://github.com/mdabdulawal2001/saba-modest-server.git
cd saba-modest-server
npm install
```

### 5. Configure Backend Environment Variables

Create a `.env` file in the backend project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=your_base_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Use the actual environment variable names expected by the backend code. Configure your Google OAuth credentials and callback URLs according to your Better Auth setup.

> **Note:** `PORT=5000` is an example local port. If your backend uses another port, update the port and the corresponding frontend URLs accordingly. If the existing project uses different environment variable names or authentication URL conventions, follow the actual project configuration rather than renaming variables blindly.

### 6. Start the Backend

Check the `scripts` section of the backend's `package.json`. If it provides a `dev` script, run:

```bash
npm run dev
```

If the project uses a different start command, use the appropriate script from `package.json`.

The frontend and backend must both be running for the complete local application to work.

---

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL used by the frontend |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth URL, according to the project's configuration |
| `BETTER_AUTH_SECRET` | Secret used for authentication-related security |
| `MONGODB_URI` | MongoDB database connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

**Security guidelines**

- Never commit `.env`, `.env.local`, or real credentials to GitHub.
- Keep `BETTER_AUTH_SECRET`, `MONGODB_URI`, and `GOOGLE_CLIENT_SECRET` private.
- Variables beginning with `NEXT_PUBLIC_` can be exposed to the browser. Never place secrets in them.
- Configure production environment variables in Vercel and Render settings.
- Ensure the Google OAuth authorized origins and redirect URIs match your actual deployment and Better Auth configuration.

---

## 🏗️ Project Architecture

```text
SABA MODEST
│
├── saba-modest-client
│   ├── Next.js
│   ├── React UI
│   ├── Authentication
│   ├── Product Pages
│   └── API Integration
│
└── saba-modest-server
    ├── Node.js
    ├── Express.js
    ├── Better Auth
    ├── API Routes
    └── MongoDB
```

## 🌐 Deployment

The frontend and backend are deployed separately.

- **Frontend:** [Vercel](https://saba-modest-client.vercel.app/)
- **Backend API:** [Render](https://saba-modest-server.onrender.com/)

The deployed frontend communicates with the backend API to retrieve and manage application data.

## 👨‍💻 Developer

<p align="center">
  Developed with ❤️ by
</p>

<h3 align="center">MD. ABDUL AWAL TOHA</h3>

<p align="center">
  <a href="https://github.com/mdabdulawal2001">
    <img src="https://img.shields.io/badge/GitHub-Visit_Profile-black?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
</p>

---

<p align="center">
  ⭐ Thanks for visiting SABA MODEST!
</p>
