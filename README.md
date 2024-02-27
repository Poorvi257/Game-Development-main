# Game Development Task

## Overview

Created a game using React.js and Node.js, integrating with the Valorant API and DB.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js
- npm or yarn

## Setup

### Backend Setup

#### Install dependencies
Navigate to the backend directory and install the necessary npm packages.
```bash
cd backend
npm install
```

#### Environment Variables
Create a .env file in the backend directory and fill it with the required environment variables:

```bash
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

#### Database Setup
- **Local Setup**: Ensure your database (e.g., MySQL) is installed and running. Create a database and update the `.env` file with your database connection details.
- **Create Database**: Run this script to create database on your local
```bash
brew services start mysql
mysql -u user -p
```

- **Initialize Database**: 
Run the database migration scripts you have to set up your database schema and initial data.
```bash
npm run migrate
```

### Frontend Setup

#### Install dependencies
Navigate to the frontend directory and install the required npm packages.

```bash
cd frontend
npm install
```

#### Create a .env file in the frontend directory to store environment variables such as the backend API URL.

`REACT_APP_API_URL=http://localhost:8000/api/v1/`

## Running the Application

### Backend

- **Development Mode**: Start the backend in development mode with live reload:
```bash
npm run start
```

- **Production Mode**: Launch the backend for production:
```bash
npm run start
```

### Accessing the Application
After starting both the frontend and backend, you can access the application in your browser:

Frontend URL: `http://localhost:3000` (or the port you configured for React)

Backend API Base URL: `http://localhost:8000`

## Testing

### Backend Testing
Execute backend tests with:
```bash
cd backend
npm test
```
