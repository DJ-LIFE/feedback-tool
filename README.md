# Feedback Tool

A comprehensive feedback management system with admin dashboard for monitoring and analyzing product feedback.

## 📋 Project Overview

This project is a full-stack application that allows users to submit feedback on products and provides administrators with tools to manage and analyze this feedback. The application consists of two main parts:

-   **Frontend**: A Next.js application with an intuitive UI for users to browse products and submit feedback, and an admin dashboard for managing feedback.
-   **Backend**: An Express.js API with PostgreSQL database (via Prisma ORM) that handles data storage and business logic.

## 🚀 Features

### User Features

-   Browse product listings
-   View detailed product information
-   Submit feedback with ratings
-   Anonymous feedback option

### Admin Features

-   Secure authentication system (login/register)
-   Comprehensive dashboard with analytics
-   Feedback management and filtering
-   Rating distribution visualization
-   Timeline data for tracking feedback trends
-   Popularity score metrics

## 🛠️ Tech Stack

### Frontend

-   [Next.js 15](https://nextjs.org/) - React framework
-   [React 19](https://reactjs.org/) - UI library
-   [Zustand](https://github.com/pmndrs/zustand) - State management
-   [Axios](https://axios-http.com/) - HTTP client
-   [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) - Data visualization
-   [React Hook Form](https://react-hook-form.com/) & [Zod](https://github.com/colinhacks/zod) - Form validation
-   [TailwindCSS](https://tailwindcss.com/) - Styling

### Backend

-   [Express.js](https://expressjs.com/) - Node.js web framework
-   [Prisma](https://www.prisma.io/) - ORM
-   [PostgreSQL](https://www.postgresql.org/) - Database
-   [JSON Web Tokens](https://jwt.io/) - Authentication
-   [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📦 Project Structure

```
/
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js app router pages
│   │   ├── admin/          # Admin section (dashboard, login, register)
│   │   ├── products/       # Product pages
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── feedbackForm.tsx/# Feedback submission components
│   │   └── ui/             # Generic UI components
│   ├── lib/                # Utility functions
│   │   └── api.ts          # API client configuration
│   ├── store/              # Zustand state management
│   └── types.ts            # TypeScript type definitions
│
├── backend/                # Express.js backend application
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── data/           # Data access layer
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Entry point
│   └── .env                # Environment variables
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   PostgreSQL database

### Frontend Setup

1. Clone the repository

    ```bash
    git clone https://github.com/yourusername/selfex.git
    cd selfex/frontend
    ```

2. Install dependencies

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create `.env.local` file with required environment variables

    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
    ```

4. Start the development server

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Navigate to the backend directory

    ```bash
    cd ../backend
    ```

2. Install dependencies

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create `.env` file with required environment variables

    ```
    PORT=8081
    DATABASE_URL="postgresql://username:password@localhost:5432/selfex?schema=public"
    JWT_SECRET="your-secret-key"
    ```

4. Generate Prisma client

    ```bash
    npx prisma generate
    ```

5. Run database migrations

    ```bash
    npx prisma migrate dev
    ```

6. Start the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## 🔧 API Endpoints

### Products

-   `GET /api/products` - Get all products
-   `GET /api/products/:id` - Get product by ID
-   `GET /api/products/category/:category` - Get products by category

### Feedback

-   `POST /api/feedback` - Submit new feedback

### Admin

-   `POST /api/admin/register` - Register new admin
-   `POST /api/admin/login` - Admin login

### Admin Panel

-   `GET /api/admin-panel/feedback` - Get all feedback (with filtering)
-   `GET /api/admin-panel/stats` - Get feedback statistics

## 📊 Data Models

### Feedback

```prisma
model Feedback {
  id        String   @id @default(cuid())
  name      String?
  email     String?
  feedback  String
  rating    Int
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime

  @@map("feedbacks")
}
```

### Admin

```prisma
model Admin {
  id       String @id @default(cuid())
  username String @unique
  email    String @unique
  password String // Hashed password
}
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and added to API requests using an Axios interceptor.

## 📱 Responsive Design

The application is fully responsive and works well on mobile, tablet, and desktop devices thanks to TailwindCSS utility classes.

## 🧪 Future Improvements

-   Enhanced analytics with more metrics
-   User roles and permissions
-   Feedback comment threads
-   Email notifications for new feedback

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
