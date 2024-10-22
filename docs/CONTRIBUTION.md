# Contributing:

We welcome contributions to the Session Creator project! Here's how you can help:

1.  **Report issues:** Found a bug? Let us know by creating a detailed issue on the GitHub repository. Include steps to reproduce the issue.

2.  **Suggest features:** Have an idea for a new feature? Open an issue to discuss your proposal and how it would improve the project.

3.  **Contribute code:** Before starting on a larger feature, please open an issue to discuss it with the team. Then, follow these guidelines:
    - Fork the repository.
    - Create a new branch with a descriptive name (e.g., feature/name).
    - Make your changes, following established coding style and TypeScript best practices.
    - Open a pull request with a clear description of your contribution.

## Docker Setup

We have integrated Docker to streamline the development and deployment process. Here&apos;s how you can use it:

1. **Build the Docker image:**

   ```bash
   docker build -t quiz-creator .
   ```

2. **Run the Docker container:**

   ```bash
   docker run --env-file .env -p 3000:3000 quiz-creator
   ```

Make sure to copy the `.env.example` file to `.env` and fill in the required values before running the Docker container.
