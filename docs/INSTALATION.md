# How to Setup

## Prerequisites

- Node.js and npm (or yarn/pnpm) [Download](https://nodejs.org/en/download)
  - Node --version: `>=20`
  - Use [(Node Version Manager (nvm)](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to manage the version of node.
  - After installing `nvm` install v20 of node, that will install `node v20` along with supported `npm` version.
    ```bash
    nvm install 20
    ```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/avantifellows/quiz-creator.git
   ```

2. **Install dependencies:**

   ```bash
   cd quiz-creator
   nvm use 20
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

2. **Start the Server:**

   ```bash
   npm run start
   ```

## Run Docker Container

1. **Build the Docker image:**

   ```bash
   docker build -t quiz-creator .
   ```

2. **Run the Docker container:**

   ```bash
   docker run --env-file .env -p 3000:3000 quiz-creator
   ```

## Other Useful Scripts

1. **Linting & Formating:**

   ```bash
   npm run lint:fix
   npm run format
   ```

2. **Unit Testing:**

   ```bash
   npm run test:jest
   ```

3. **E2E Testing:**

   ```bash
   npm run test:cypress
   ```
