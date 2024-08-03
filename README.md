# Ticket Management System - README

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)
5. [Running the Application](#running-the-application)
6. [Endpoints and API Documentation](#endpoints-and-api-documentation)
7. [Future Prospects](#future-prospects)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

The Ticket Management System is a web application designed to streamline the process of managing and tracking tickets for various issues and requests within an organization. It supports dynamic user roles and provides a user-friendly interface for creating, assigning, and tracking tickets.

## Features

- Dynamic user roles (Admin, Internal, Partner, Helpdesk) with tailored permissions.
- Automated field setting for `Requested_by`, `Organization`, and `Partner_Name`.
- Dynamic dropdowns based on user role and organization selection.
- Multi-file uploads with support for various file types.
- Responsive UI designed with Tailwind CSS.
- Role-based access control.
- Real-time updates and notifications.

## Technologies Used

- **Frontend:** React, Tailwind CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT, LocalStorage
- **Deployment (Future):** AWS (EC2, RDS, S3), Nginx, PM2

## Setup and Installation

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- PostgreSQL

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/ticket-management-system.git
   cd ticket-management-system/backend

2. **Install Dependencies:**
   ```bash
   npm install

3. **Setup Postgres:**
   ```bash
   {
    "development": {
        "username": "your_db_username",
        "password": "your_db_password",
        "database": "your_db_name",
        "host": "127.0.0.1",
        "dialect": "postgres"
        }
    }

4. **Run Database Migrations:**
   ```bash
   npx sequelize-cli db:migrate

5. **Start backend server:**
   ```bash
   npm start
    ```

## Endpoints and API Documentation

### User Routes

- **GET /api/users**: Get all users
- **GET /api/users/:id**: Get a specific user
- **POST /api/users**: Create a new user
- **PUT /api/users/:id**: Update a user
- **DELETE /api/users/:id**: Delete a user

### Ticket Routes

- **GET /api/tickets**: Get all tickets
- **GET /api/tickets/:id**: Get a specific ticket
- **POST /api/tickets**: Create a new ticket
- **PUT /api/tickets/:id**: Update a ticket
- **DELETE /api/tickets/:id**: Delete a ticket

## Future Prospects

### Deployment on AWS

- **AWS EC2**: Set up an EC2 instance to host the backend server.
- **AWS RDS**: Migrate the PostgreSQL database to AWS RDS for better scalability and management.
- **AWS S3**: Use S3 for storing uploaded files.
- **Nginx**: Configure Nginx as a reverse proxy to manage incoming requests.
- **PM2**: Use PM2 process manager to ensure the Node.js application runs continuously and to manage downtimes.

### Learning Opportunities

- **AWS**: Gain expertise in setting up and managing AWS services.
- **Nginx**: Learn to configure and optimize Nginx for better performance and security.
- **PM2**: Use PM2 for advanced process management and monitoring.

## Contributing

We welcome contributions to improve the Ticket Management System. Please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.