# Inventory Management System

An Inventory Management System built with Next.js, NestJS, TypeORM, MySQL, Redis, and Chakra UI. This project allows different types of users (Admin, Manager, Viewer) to manage inventory, view items, and send reports to merchants.

## Technologies Used

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-262627?style=for-the-badge&logo=typeorm&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2C8EBB?style=for-the-badge&logo=docker&logoColor=white)
![Docker](https://img.shields.io/badge/Kubernetes-4479A1?style=for-the-badge&logo=Kubernetes&logoColor=white)
## Features

- **Admin**
  - Manage users (add, update, disable)
  - Perform all Manager and Viewer tasks
- **Manager**
  - Add, remove, and update inventory items
  - Send inventory summary reports to merchants
  - Perform all Viewer tasks
- **Viewer**
  - View inventory items and their quantities

## Prerequisites

- Node.js
- Yarn

## Getting Started

### Backend

1. Clone the repository:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Set up environment variables in a `.env` file in the backend root:

    ```env
    MYSQL_HOST=
    MYSQL_PORT=
    MYSQL_DATABASE=
    MYSQL_USERNAME=
    MYSQL_PASSWORD=
    MYSQL_SYNCHRONIZE=
    JWT_SECRET=
    BREVO_SMTP=
    BREVO_USER=
    BREVO_PASS=
    EMAIL_FROM_ADDRESS=ims@noreply.com
    REDIS_HOST=
    REDIS_PORT=
    REDIS_PASSWORD=
    ```

4. Run the backend server:

    ```bash
    yarn dev
    ```

    The backend API will be available at `http://localhost:9000/v1` and the Swagger documentation at `http://localhost:9000/doc`.

### Frontend

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Set up environment variables in a `.env.local` file in the frontend root:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:9000/v1
    ```

4. Run the frontend server:

    ```bash
    yarn dev
    ```

    The frontend will be available at `http://localhost:3000`.



### Kubernetes (k8s)

1. The Kubernetes manifests for deploying the services are located in the `k8s` directory. 

2. The list of YAML files in the directory are as follows:
    - `brevo-secret.yaml`
    - `jwt-secret.yaml`
    - `mysql-secret.yaml`
    - `mysql.yaml`
    - `nestjs.yaml`
    - `nginx.yaml`
    - `redis-secret.yaml`
    - `redis.yaml`

These files contain the necessary configurations for deploying the backend, database, Redis, and other related services on a Kubernetes cluster.

### NGINX

NGINX is used as the load balancer in this setup. The `nginx.yaml` file in the `k8s` directory contains the configuration for setting up NGINX to manage traffic to the backend services.
