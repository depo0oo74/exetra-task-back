# Exetra backend task Project

This is a project built with Express.js, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Watch Mode](#watch-mode)
  - [Production Mode](#production-mode)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (optional but recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:depo0oo74/exetra-task-back.git
   

2. Navigate to the project folder

  cd exetra-task-back

3. Install dependencies

  npm install



### Running the application

1. Development Mode

  npm run start

2. Watch Mode

  npm run dev

2. Production Mode

  npm run build

### Project structure
project/
├── src/
│   ├── app.ts
│   ├── database.ts
│   ├── controllers/
│   │   ├── auth.ts
│   ├── models/
│   │   ├── user.ts
│   ├── routes/
│   │   ├── auth.ts
│   ├── utils/
│   │   ├── handlingErrors.ts
├── .env
├── .env.example
├── .gitignore
├── packege-lock.json
├── package.json
├── tsconfig.json
└── README.md