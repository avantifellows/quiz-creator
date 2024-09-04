# How to Setup

## Prerequisites

- Node.js and npm (or yarn/pnpm) [Download](https://nodejs.org/en/download)

- Docker and Docker Compose [Download](https://docs.docker.com/get-docker/)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/avantifellows/quiz-creator.git
   ```

2. **Install dependencies:**

   ```bash
   cd quiz-creator
   npm ci
   ```

3. **Set up environment variables:**

   Create a .env.local file and add the required variables values

   ```bash
   cp .env.example .env.local
   ```

## Run Local Server

1. **Start the development environment:**

   ```bash
   npm run dev
   ```

2. **Access the application:**

   The application should be accessible at [`http://localhost:3000`](http://localhost:3000).

## Run Production Server

1. **Build the application:**

   ```bash
   npm run build
   ```

1. **Start the Server:**

   ```bash
   npm run start
   ```
