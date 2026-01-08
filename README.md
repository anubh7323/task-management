# Task Management System

A robust, full-stack task management application built with a modern tech stack. This application allows users to register, login, and manage their daily tasks with features like searching, filtering, and pagination.

![Dashboard](assets/dashboard-tasks.png)

## 📸 Screenshots

| Login Page | Register Page |
|:---:|:---:|
| ![Login](assets/login.png) | ![Register](assets/register.png) |

| Dashboard (Empty) | New Task Modal |
|:---:|:---:|
| ![Dashboard Empty](assets/dashboard-empty.png) | ![New Task](assets/new-task.png) |

## 🚀 specialized Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh Tokens) & bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State/Animations**: Framer Motion
- **HTTP Client**: Axios with Interceptors
- **Notifications**: Sonner

## ✨ Features

- **Authentication**: Secure User Registration and Login.
- **Token Management**: Automatic access token refresh using http-only logic (simulated via local storage for this demo).
- **Task CRUD**: Create, Read, Update, and Delete tasks.
- **Smart Dashboard**:
  - **Pagination**: Navigate through pages of tasks.
  - **Filtering**: Filter tasks by status (Pending, In Progress, Completed).
  - **Search**: Real-time task searching by title.
- **Responsive Design**: Fully responsive UI for desktop and mobile.

## 📂 Project Structure

```
task-management-system/
├── backend/                # Express.js Server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth & Error handling
│   │   ├── routes/         # API Route definitions
│   │   ├── utils/          # Validation schemas & helpers
│   │   ├── app.ts          # App entry point
│   │   └── server.ts       # Server listener
│   └── prisma/            # Database schema
│
└── frontend/               # Next.js Application
    ├── src/
    │   ├── app/            # App Router pages
    │   ├── components/     # Reusable UI components
    │   ├── lib/            # API client configuration
    │   └── context/       # React Context providers
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Clone the Repository
```bash
git clone https://github.com/anubh7323/task-management.git
cd task-management-system
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb?schema=public"
JWT_ACCESS_SECRET="your_access_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"
```

Run Database Migrations:
```bash
npx prisma migrate dev --name init
```

Start the Backend Server:
```bash
npm run dev
```
*The server will start on http://localhost:4000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Next.js Development Server:
```bash
npm run dev
```
*The application will start on http://localhost:3000*

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Tasks
- `GET /tasks` - Fetch tasks (supports `page`, `limit`, `status`, `search` params)
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get specific task details
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/toggle` - Toggle task completion status

## 🛡️ Engineering Standards
- **Strict Typing**: TypeScript used extensively across the stack.
- **Validation**: Inputs validated using Zod schemas on both client and server.
- **Component Design**: Modular, reusable components using Shadcn UI principles.
- **Clean Architecture**: Separation of concerns with controller-service-repository pattern elements.
