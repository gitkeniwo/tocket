# Tocket - Your Ticket Storage

Tocket is a web application for storing and organizing your tickets (movie tickets, museum tickets, etc.). Upload pictures of your tickets, add details like event time, location, and custom tags to keep track of your memories.

## Features

- Upload and store ticket images
- Add details like event time, location, and description
- Tag tickets for easy categorization
- View, edit, and delete tickets
- Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Go with Gin framework and GORM (SQLite database)
- **Frontend**: React with TypeScript, Material-UI, and Vite

## Running with Docker

The easiest way to run the application is using Docker:

1. Build the Docker image:
   ```bash
   docker build -t tocket .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 -v $(pwd)/uploads:/app/uploads tocket
   ```

The application will be available at http://localhost:8080.

## GitHub Container Registry

This project is configured with GitHub Actions to automatically build and push Docker images to GitHub Container Registry (GHCR) whenever:
- A commit is pushed to the main/master branch
- A pull request is merged into the main/master branch

To use the pre-built container:

```bash
docker pull ghcr.io/USERNAME/tocket:latest
docker run -p 8080:8080 -v $(pwd)/uploads:/app/uploads ghcr.io/USERNAME/tocket:latest
```

Replace `USERNAME` with your GitHub username.

## Manual Setup

### Prerequisites

- Go (1.21 or later)
- Node.js (16 or later)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Go dependencies:
   ```
   go mod tidy
   ```

3. Run the backend server:
   ```
   go run main.go
   ```

The backend server will start on http://localhost:8080.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or if you use yarn:
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

The frontend development server will start on http://localhost:3000.

## Project Structure

```
tocket/
├── backend/
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── uploads/      # Uploaded ticket images
│   ├── go.mod        # Go module file
│   └── main.go       # Main application entry point
└── frontend/
    ├── public/       # Static assets
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API services
    │   ├── App.tsx      # Main App component
    │   └── main.tsx     # Application entry point
    ├── package.json   # npm/yarn dependencies
    └── vite.config.ts # Vite configuration
```

## API Endpoints

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get a specific ticket
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket
- `POST /api/tickets/upload` - Upload a ticket image

## Docker Volume

When running with Docker, the uploads directory is mounted as a volume to persist ticket images. This means your uploaded images will be saved on your host machine and won't be lost when the container is restarted.

## License

This project is licensed under the MIT License. 