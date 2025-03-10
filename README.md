
# TunisBus Harmony Scheduler

## Project Structure

The application is organized into three main directories:

- **frontend**: Contains the React application with UI components and pages
- **backend**: Contains the Express.js server and API endpoints
- **database**: Contains database schema and migrations

## Development Setup

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PostgreSQL database (local or Docker)

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd tunisbus-harmony-scheduler

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Start the development server
npm run dev
```

## Docker Deployment

### Build and run with Docker Compose

```sh
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

### Build Docker image manually

```sh
# Build the Docker image
docker build -t tunisbus-harmony-scheduler .

# Run the container
docker run -p 8080:8080 -p 5000:5000 --env-file .env tunisbus-harmony-scheduler
```

## Features

- Bus route scheduling and management
- Responsive design for all devices
- Multi-language support (French, English, Arabic)
- Admin dashboard for route management
- User-friendly search interface

## Tech Stack

- Frontend: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- Backend: Node.js, Express.js, PostgreSQL
- Infrastructure: Docker, Docker Compose
