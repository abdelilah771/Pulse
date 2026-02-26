# Pulse ⚡

A modern, high-performance productivity dashboard and planner web application built to help you stay focused. Pulse brings together task management, project tracking, rapid notes, and KPI insights—all wrapped in a stunning, interactive Glassmorphism UI.

## Features ✨

- **Daily Kanban Planner**: Organize your day into Morning, Afternoon, and Evening blocks.
- **Project & Task Management**: Full CRUD capabilities mapped seamlessly in your dashboard. Colored tags to visually differentiate your ventures.
- **Glassmorphism Design**: Sleek, immersive aesthetic utilizing Tailwind CSS v4, custom scrollbars, and ambient dynamic backgrounds.
- **Performance First**: Built on Next.js App Router (React Server Components + Server Actions).
- **Secure Backend**: Powered by Supabase Auth & PostgreSQL.
- **Type-Safe ORM**: Fully typed database interactions using Drizzle ORM.
- **Automated CI/CD**: Integrated with GitHub Actions and SonarQube for continuous code quality analysis.

## Tech Stack 🛠️

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: PostgreSQL via [Supabase](https://supabase.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Components**: Radix UI / Lucide Icons
- **Infrastructure CI/CD**: GitHub Actions + SonarCloud

## Getting Started 🚀

### 1. Clone the repository
```bash
git clone https://github.com/abdelilah771/Pulse.git
cd Pulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` and `.env.local` file at the root of the project to match the necessary Supabase credentials.

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# .env
DATABASE_URL=your-connection-string
AUTH_SECRET=your-auth-secret
```

### 4. Database Push (Drizzle)
Push the schema to your Supabase PostgreSQL database:
```bash
npx drizzle-kit push
```

### 5. Run the application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CI/CD & Code Quality 🛡️

This repository uses GitHub Actions to run CI checks on every push to the `main` and `dev` branches. 
- It performs a Node.js build pipeline (`npm ci`, `npm audit`, `npm run build`).
- It integrates with **SonarQube** to scan for code smells, bugs, and security vulnerabilities via the `sonar-project.properties` configuration.
