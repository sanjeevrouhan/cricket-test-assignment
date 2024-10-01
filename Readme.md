# MERN Stack Assignment

This project is a full-stack application using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It consists of a backend API built with NestJS and a frontend user interface.

## Technologies Used

### Backend

- Node.js v18.x
- NestJS v10.x
- MongoDB v6.x
- Mongoose v7.x
- Swagger UI Express v5.x
- Winston v3.x

### Frontend

- React v18.x
- TypeScript v5.x
- Vite v4.x
- Axios v1.5.x
- React Router v6.x

### Development Tools

- ESLint v8.x
- Prettier v3.x
- TypeScript v5.x

## Backend

The backend is a RESTful API built with NestJS, a progressive Node.js framework. It provides authentication endpoints and uses MongoDB as the database.

### Key Features

- Swagger API documentation
- Winston logger for comprehensive logging
- MongoDB integration using Mongoose
- Environment-based configuration

### Getting Started

1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Set up your environment variables in a `.env` file
4. Start the server: `npm run start:dev`

The API will be available at `http://localhost:3000` by default.

### API Documentation

Swagger UI is available at `/api/docs` when the server is running.

## Frontend

The frontend is a React-based user interface that interacts with the backend API.

### Getting Started

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

The application will be available at `http://localhost:3000` by default.

## Development

To run both the backend and frontend concurrently:

1. Start the backend server
2. In a new terminal, start the frontend development server
