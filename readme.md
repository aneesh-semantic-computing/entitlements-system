# Entitlement System

## Overview

The Entitlement System is designed to manage and provide access to various datasets for quants and ops teams. The system includes functionalities for user management, access request management, dataset management, and data access. The high-level architecture is built using microservices and integrates with external services and APIs.

## Domain Driven Design

### Context Map

![Domain Driven Design Context Map](file-G6YFa8iDYkrxs0aPQfduHtTE)

## Entity Relationship Diagram

### Data Model

![Entity Relationship Diagram](file-uBDEg1aQwf1LWKQaU4WPVHaq)

## High-Level Design

### System Architecture

![High Level Design](file-zu55l1d79N0UkBXSp1xWOAqC)

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

