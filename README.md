## Getting Started

First, install dependencies (`npm install`) run the development server:

```bash
npm run dev
# or
yarn dev
# or
npm dev
```

- Local `.env` file is as follows:
```
AF_DB_URL="http://localhost:3001"
AF_TOPIC_ARN=""
AF_BEARER_TOKEN=""
AF_ACCESS_KEY_ID=""
AF_SECRET_ACCESS_KEY=""
``` 
- Run `json-server --watch sessions_db.json --port 3001` on another terminal. This starts the DB. 

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project

An interface to create quizzes for the Avanti Fellows Quiz Engine, and remove the dependence on Google Sheets completely.
