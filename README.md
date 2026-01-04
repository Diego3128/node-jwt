# Nodejs Authentication with JWT 

This is a simple Node.js application that demonstrates how to implement user authentication using JSON Web Tokens (JWT). The application allows users to register, log in, and access protected routes.

## Features
- User registration
- User login
- JWT token generation
- Protected routes
- Password hashing with bcrypt
- Input validation
- Error handling

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Tokens (JWT)
- dotenv
- docker
- nodemon

## Prerequisites
- Node.js installed
- Docker installed and running
- Postman or any API testing tool (optional)
- Git installed on your machine
- A code editor like VSCode
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Diego3128/node-jwt.git
   ```

2. Navigate to the project directory:
   ```
    cd nodejs-jwt-authentication
    ```
3. Install the dependencies:
    ```
    npm install
    ```
    or
    ```
    yarn install
    ```

4. Create a `.env` file creating a copy of the .env.template file in the root directory


5. Run the docker container for MongoDB using docker-compose:
   ```
   docker-compose up -d
   ```

6. Start the application:

- in development mode with nodemon:
    ```
    npm run dev:nodemon
    ```

- in production mode:
    ```
    npm start
    ```


# Testing the API

base URL: http://localhost:3000/api/v1/auth

- POST /register : Register a new user
 payload (JSON or x-www-form-urlencoded): 
  ```
  {
    "name": "your_username",
    "email": "your_email",
    "password": "your_password"
  }
  ```

- POST /login : Login a user
 payload (JSON or x-www-form-urlencoded): 
  ```
  {
    "email": "your_email",
    "password": "your_password"
  }
  ```

- Get /validate-email/:token : Validate user email with token
