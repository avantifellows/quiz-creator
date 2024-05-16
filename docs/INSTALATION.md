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
   cd session-creator
   npm ci
   ```

3. **Set up environment variables:**

   Create a .env.local file and add any required variables

   ```bash
   cp .env.example .env.local
   ```

4. **Start the development environment:**

   ```bash
   docker compose up local
   ```

5. **Access the application:**

   The application should be accessible at [`http://localhost:3000`](http://localhost:3000).

> **Note:**
>
> - For local development, the application utilizes json-server to simulate a backend. You'll need to have actual environment variables set up to interact with the real backend services.
> - Currently, CRUD functionality may not work as expected in the local environment due to the json-server limitations. These features will function correctly when connected to the real backend.
