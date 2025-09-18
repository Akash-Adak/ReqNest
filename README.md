
# ReqNest – Cloud API Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

**ReqNest** is a **cloud-native API platform** that allows developers and non-developers to **generate backend APIs automatically** without writing traditional backend code.  

With ReqNest, users can:  
- Create **database schemas** via **AI-assisted**, **manual**, or **form-based** methods.  
- **Test APIs in-browser** like Postman.  
- **Download or update schemas** dynamically.  
- Generate **SDKs** for frontend integration – no backend coding required.  

The platform also provides **OAuth2 login** with **Google** and **GitHub**, **dynamic dashboards**, **profile management**, and full **CRUD operations** for multiple databases.  

---

## Key Features

- **Schema & API Generation**
  - AI-assisted schema creation.
  - Form-based or manual schema entry.
  - Auto-generated REST APIs for all operations.
  
- **API Testing**
  - Built-in testing like Postman.
  - Save & test endpoints directly from the platform.

- **SDK Generation**
  - Frontend SDKs to integrate APIs without backend code.

- **Authentication & Security**
  - OAuth2 login (Google, GitHub).
  - JWT-based API security.

- **Dynamic Dashboard & Profile**
  - View all APIs and their usage.
  - Manage projects and user profile easily.

- **Database Support**
  - MySQL for relational data.
  - MongoDB for NoSQL data.
  - Redis for caching and token storage.

- **Tech Stack**
  - Backend: Spring Boot
  - Frontend: React + Vite
  - Containerization: Docker
  - Orchestration: Kubernetes
  - Messaging & Caching: Kafka, Redis

---

## Architecture Overview

```

User
├─> ReqNest Frontend (React + Vite)
│      ├─ OAuth2 Login (Google/GitHub)
│      ├─ Dynamic Dashboard
│      └─ API Testing / SDK Integration
│
└─> ReqNest Backend (Spring Boot Microservices)
├─ Schema Management Service (MySQL/MongoDB)
├─ API Generation Service
├─ SDK Service
├─ Auth Service (OAuth2 + JWT)
└─ Cache & Messaging (Redis + Kafka)

````

---

## Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Spring Boot (Java 17)  
- **Databases:** MySQL, MongoDB, Redis  
- **Messaging:** Kafka  
- **Authentication:** OAuth2 (Google, GitHub), JWT  
- **Containerization:** Docker  
- **Orchestration:** Kubernetes  
- **Monitoring:** Prometheus & Grafana (optional)  

---

## Getting Started

### Option 1: Run via Docker Hub

You can try ReqNest immediately using our pre-built Docker image:

```bash
# Pull the latest image
docker pull akta2910/reqnest:latest

# Run the container
version: "3.9"

services:
  backend:
    build: .
    image:  akta2910/reqnest-backend:latest
    container_name: backend-platform
    ports:
      - "8080:8080"
    env_file: .env
    environment:
      SERVER_PORT: 8080   # <--- this sets Spring Boot port
      SPRING_DATASOURCE_URL: jdbc:mysql://${DB_HOST}:${DB_PORT:-3306}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASS}
      SPRING_DATA_MONGODB_URI: ${MONGO_URI}
      SPRING_REDIS_HOST: ${REDIS_HOST}
      SPRING_REDIS_PORT: ${REDIS_PORT}
      SPRING_REDIS_USERNAME: ${REDIS_USER}
      SPRING_REDIS_PASSWORD: ${REDIS_PASS}
    depends_on:
      - mysql
      - mongo
      - redis
    networks:
      - cloudnet
      - default   # ✅ add access to external internet
    dns:          # ✅ force reliable DNS for Gmail
      - 8.8.8.8
      - 8.8.4.4

  mysql:
    image: mysql:8.0
    container_name: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS}
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "3307:3306"
    networks:
      - cloudnet
    volumes:
      - mysql_data:/var/lib/mysql

  mongo:
    image: mongo:6
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"
    networks:
      - cloudnet
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    networks:
      - cloudnet
    volumes:
      - redis_data:/data

networks:
  cloudnet:
  default: {}   # ✅ enable internet + external DNS

volumes:
  mysql_data:
  mongo_data:
  redis_data:
````

* Frontend: `http://localhost:5173`
* Backend APIs: `http://localhost:8080`

> You now have a fully functional ReqNest instance running locally without building it from source.

---

### Option 2: Run Locally (From Source)

1. Clone the repo:

```bash
git clone https://github.com/akashadak/reqnest.git
cd reqnest
```

2. Build backend:

```bash
cd backend
./mvnw clean install
```

3. Build frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Start Docker services:

```bash
docker-compose up -d
```

---

### Kubernetes Deployment

1. Apply namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

2. Apply secrets:

```bash
kubectl apply -f k8s/secrets.yaml
```

3. Deploy databases (MySQL, MongoDB, Redis):

```bash
kubectl apply -f k8s/databases.yaml
```

4. Deploy backend and frontend:

```bash
kubectl apply -f k8s/deployments/
```

5. Deploy ingress:

```bash
kubectl apply -f k8s/ingress.yaml
```

6. Verify:

```bash
kubectl get pods -n reqnest
kubectl get svc -n reqnest
```

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/xyz`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Contact

**Akash Adak**

* GitHub: [https://github.com/akashadak](https://github.com/akashadak)
* Email: [akashadak@example.com](mailto:akashadak@example.com)

```

