# AWS_FS_ABR25_D02_COMPASS_GameList_PB

This project is a GameList application designed to showcase a full-stack development approach. It consists of a client-side interface and a server-side API to manage a list of games.

## Project Overview

### Client
The client is the front-end part of the application. It is responsible for:
- Displaying the list of games to the user.
- Providing an interface for users to interact with the game data (e.g., view details, potentially add or search for games).
- Communicating with the server API to fetch and send game data.

### Server
The server is the back-end part of the application. Its main responsibilities include:
- Providing API endpoints for CRUD (Create, Read, Update, Delete) operations on games.
- Handling business logic related to game management.
- Interacting with the database to store and retrieve game information using Prisma ORM.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18.x or later recommended)
- npm or yarn
- SQLite (as configured in your `prisma/schema.prisma` file). Other databases like PostgreSQL or MySQL can also be configured.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gabrielbembem/AWS_FS_ABR25_D02_COMPASS_GameList_PB
    cd AWS_FS_ABR25_D02_COMPASS_GameList_PB
    ```

2.  **Install Server Dependencies:**
    Navigate to the server directory (assuming it's named `server` or is in the root) and install dependencies.
    ```bash
    # If you have a separate server directory:
    # cd server
    npm install
    # or
    # yarn install
    ```

3.  **Install Client Dependencies:**
    Navigate to the client directory (assuming it's named `client`) and install dependencies.
    ```bash
    # If you have a separate client directory:
    # cd ../client
    # If not, and client is in a subfolder of the root:
    # cd client
    npm install
    # or
    # yarn install
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the server's root directory (or where your `schema.prisma` expects it). This file should contain your database connection URL and any other necessary environment variables.
    Example `DATABASE_URL` for SQLite:
    ```env
    DATABASE_URL="file:./dev.db"
    ```

5.  **Database Setup (using Prisma):**
    From the server directory (or the project root if Prisma is configured there):
    ```bash
    # Generate Prisma Client based on your schema
    npx prisma generate

    # Apply database migrations to create/update your database schema
    npx prisma migrate dev
    ```
    You might be prompted to name your migration.

## Running the Application

1.  **Start the Server:**
    In the server directory:
    ```bash
    npm run dev
    # or
    # yarn dev
    # (or the script you have defined in your package.json to start the server)
    ```

2.  **Start the Client:**
    In the client directory:
    ```bash
    npm run dev
    # or
    # yarn dev
    # (or the script you have defined in your package.json to start the client)
    ```

The client application should now be accessible in your browser (usually at `http://localhost:5000` or a similar port), and the server API will be running (often on a port like `http://localhost:3001`).
