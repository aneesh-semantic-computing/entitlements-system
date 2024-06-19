# Entitlement System

## Overview

The Entitlement System is designed to manage and provide access to various datasets for quants and ops teams. The system includes functionalities for user management, access request management, dataset management, and data access. The high-level architecture is built using microservices and integrates with external services and APIs.

## Domain Driven Design

![Domain Diagram](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/f328e570-5732-4a52-ab8d-729f0a5ec7c7)


## Entity Relationship Diagram

![ERD](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/0256c745-09a6-47ae-bd41-22a0026892c5)


## High-Level Design

![High Level Design](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/61f178aa-4faa-49d5-a19e-75e4873bd6d2)


## Microservices

### User Management Service

This service handles user information and their access configurations.

### Access Request Service

This service manages the creation, approval, and rejection of access requests.

### Dataset Service

This service provides access to the various datasets, ensuring the user has the necessary permissions.

### Notification Service

This service will send notifications to users and ops regarding the status of access requests. This is ot implemented.

## Setup and Deployment

### Prerequisites

- Docker
- Docker Compose
- Node.js
- Yarn

### Running Locally

1.   **Clone the repository**
      ```sh
      git clone <repository-url>
      cd entitlement-system
      ```
2.   **Install dependencies**
      ```sh
      yarn install
      ```
3.    **Environment Variables**
      - Create a .env file in the root directory and provide the necessary environment variables.

4.    **Run Docker Compose**
      ```sh
      docker-compose up --build
      ```
5.    **Seeding the Database**
        - The database can be seeded with initial data using the seed scripts provided in each microservice.

### Accessing Services
-  User Management Service: http://localhost:3001
-  Access Request Service: http://localhost:3002
-  Dataset Service: http://localhost:3003
-  Notification Service: http://localhost:3004

