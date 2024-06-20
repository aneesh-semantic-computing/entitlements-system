# Entitlement System

## Overview

The Entitlement System is designed to manage and provide access to various datasets for quants and ops teams. The system includes functionalities for user management, access request management, dataset management, and data access. The high-level architecture is built using microservices and integrates with external services and APIs.

## Domain Driven Design

![Domain Diagram](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/47dd5b1a-4971-4ac1-b11a-1b220cf423f5)


## Entity Relationship Diagram

![ERD](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/98b2bc1d-4d0f-4855-89d0-0a38633b8b4f)


## High-Level Design

![High Level Design](https://github.com/aneesh-semantic-computing/entitlements-system/assets/45017458/b8c2dafe-cab4-4041-bf6b-f438b5b65061)


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

