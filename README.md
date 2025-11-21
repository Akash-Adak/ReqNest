
<div align="center">

# 🚀 ReqNest  
### *Transform Ideas into Production APIs in Minutes*

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-welcome-blue?style=for-the-badge)

<img src="images/home.png" width="100%" />

</div>

---

# 📌 Overview

**ReqNest** is a cloud-native backend automation platform that converts data models into **fully functional production APIs** in minutes.

Think of it as:  
### **⚡ Vercel + Firebase + Postman + Swagger → Combined for Backend APIs**

Built with:

- **React + Vite + Tailwind**
- **Spring Boot + Java 17**
- **MySQL • MongoDB • Redis**
- **Kubernetes + Docker + Ngrok**
- **Google OAuth2 Login**

---

# 🔥 Features

### 🧠 AI-Powered Schema Builder  
Convert plain English → Optimized DB schema.

### ⚡ Instant API Generation  
REST, GraphQL, WebSocket auto-generated.

### 🛡 Security  
OAuth2, JWT, RBAC, CORS, rate limiting.

### 📱 SDKs  
Auto-generated client SDKs for React, Vue, Flutter, Node, Java, Python, Go.

### 🧘 Simplified DevOps  
Built for Kubernetes, supports Ngrok, Docker, and local development.

---

# 🧩 Project Architecture

```

frontend  →  Nginx → Ingress → Backend → DB / Redis / Mongo
↑
Ngrok

````

- **Frontend**: React + Vite  
- **Backend**: Spring Boot 3  
- **Runtime ENV**: config.js (generated at container startup)  
- **Ingress**: Prefix paths (`/api`, `/oauth2`, `/login/oauth2`)  
- **Ngrok**: Public HTTPS URL for OAuth Redirect  

---

# 🛠 Tech Stack

### **Frontend**
- React 18
- Vite
- Tailwind CSS
- Nginx Runtime Config (config.js)

### **Backend**
- Spring Boot 3
- OAuth2 (Google Login)
- JWT Authentication
- Kafka-ready architecture

### **Infrastructure**
- Kubernetes (Kind)
- Docker
- Nginx Ingress Controller
- Ngrok (for external HTTPS)
- MySQL + MongoDB + Redis

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone https://github.com/reqnest/platform.git
cd reqnest-platform
````

---

# ⚙️ Frontend Setup (React + Vite + Nginx Runtime Env)

### 📌 Build Commands

```bash
cd frontend
yarn install
yarn build
```

### 📌 Production Dockerfile uses **runtime config.js**

Your `entrypoint.sh` dynamically creates:

```
window._env_ = {
  VITE_API_URL: "https://your-ngrok/api"
};
```

This avoids rebuilding when endpoints change.

### 📌 **Nginx Config Used**

```
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location = /config.js {
        try_files $uri =404;
    }

    location /assets/ {
        try_files $uri =404;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

---

# 🏗 Backend Setup (Spring Boot 3)

### Run locally:

```bash
./mvnw spring-boot:run
```

### Important Properties:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            redirect-uri: "{baseUrl}/login/oauth2/code/google"

server:
  forward-headers-strategy: framework
```

---

# 🌐 Google OAuth2 Setup

### Required Redirect URI:

```
https://<your-ngrok-domain>/login/oauth2/code/google
```

### Required JavaScript Origin:

```
https://<your-ngrok-domain>
```

### Must add under “Authorized Domains”:

```
<your-ngrok-domain>
```

---

# 🛜 Kubernetes Deployment

### Install Ingress Controller (Kind)

```bash
kubectl apply -f ingress-nginx/install.yaml
```

### Apply DB + Redis + Backend + Frontend + Ingress:

```bash
kubectl apply -f k8s/
```

### Ingress Configuration (Final Working)

```yaml
/api            → backend:8080  
/oauth2         → backend:8080  
/login/oauth2   → backend:8080  
/               → frontend:80
```

---

# 🛰 Exposure via Ngrok

Expose Ingress:

```bash
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
ngrok http http://localhost:8080
```

Copy the URL:

```
https://xxxxx.ngrok-free.dev
```

Update in:

* frontend configMap
* backend configMap
* Google Cloud OAuth
* config.js runtime

Then reload:

```bash
kubectl rollout restart deployment frontend -n reqnest
kubectl rollout restart deployment backend -n reqnest
```

---

# 📦 Folder Structure

```
.github/
    └── workflows/
        ├── docker-push.yml
        └── springboot-test.yml
.idea/
    ├── .gitignore
    ├── compiler.xml
    ├── encodings.xml
    ├── jarRepositories.xml
    ├── misc.xml
    ├── modules.xml
    ├── ReqNest.iml
    └── vcs.xml
backend-engine/
    ├── .mvn/
        └── wrapper/
            └── maven-wrapper.properties
    ├── src/
        ├── main/
            ├── java/
                └── com/
                    └── akash_adak/
                        └── backend_engine/
                            ├── check/
                                └── RedisHealthCheck.java
                            ├── config/
                                ├── JwtAuthenticationFilter.java
                                ├── JwtUtil.java
                                ├── OAuth2LoginSuccessHandler.java
                                ├── RateLimitingInterceptor.java
                                ├── RedisConfig.java
                                ├── SecurityConfig.java
                                └── WebConfig.java
                            ├── controller/
                                ├── ApiSchemaController.java
                                ├── CloudApiController.java
                                ├── DynamicCrudController.java
                                ├── GeminiSchemaController.java
                                ├── PaymentController.java
                                └── UserController.java
                            ├── model/
                                ├── ApiLog.java
                                ├── ApiSchema.java
                                ├── AuthResponse.java
                                ├── RequestHistory.java
                                ├── User.java
                                ├── UserApiUsage.java
                                └── UserPlan.java
                            ├── notification/
                                ├── EmailController.java
                                ├── EmailRequest.java
                                ├── EmailService.java
                                └── InvoiceGenerator.java
                            ├── repository/
                                ├── ApiLogRepository.java
                                ├── ApiSchemaRepository.java
                                ├── UserApiUsageRepository.java
                                ├── UserPlanRepository.java
                                └── UserRepository.java
                            ├── service/
                                ├── ApiService.java
                                ├── ApiUsageService.java
                                ├── CloudApiService.java
                                ├── CustomOAuth2UserService.java
                                ├── DynamicService.java
                                ├── GeminiSchemaService.java
                                ├── RateLimiterService.java
                                ├── RedisService.java
                                └── UserService.java
                            └── BackendEngineApplication.java
            └── resources/
                ├── migration/
                    └── V1__create_endpoints_and_history.sql
                ├── static/
                    └── company-logo.png
                └── application.yml
        └── test/
            ├── java/
                └── com/
                    └── akash_adak/
                        └── backend_engine/
                            └── BackendEngineApplicationTests.java
            └── resources/
                └── application-test.yml
    ├── .gitattributes
    ├── .gitignore
    ├── docker-compose.yml
    ├── Dockerfile
    ├── mvnw
    ├── mvnw.cmd
    └── pom.xml
dynamic-api-dashboard/
    ├── public/
        ├── Alex.png
        ├── cloud.webp
        ├── config.js
        ├── homepage.jpg
        ├── logo.png
        ├── michal.png
        └── Sarah.png
    ├── src/
        ├── api/
            └── index.jsx
        ├── assets/
            └── react.svg
        ├── components/
            ├── Footer.jsx
            ├── Navbar.jsx
            ├── PrivateRoute.jsx
            └── UploadSchema.jsx
        ├── contexts/
            └── AuthContext.jsx
        ├── pages/
            ├── ApiTesterTabs.jsx
            ├── AppList.jsx
            ├── Dashboard.jsx
            ├── HomePage.jsx
            ├── Login.jsx
            ├── Plans.jsx
            ├── Profile.jsx
            ├── ReqNestSDK.jsx
            └── SdkSetup.jsx
        ├── App.css
        ├── App.jsx
        ├── index.css
        └── main.jsx
    ├── .gitignore
    ├── docker-compose.yml
    ├── Dockerfile
    ├── entrypoint.sh
    ├── eslint.config.js
    ├── index.html
    ├── nginx.conf
    ├── openapitools.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    └── yarn.lock
images/
    └── home.png
k8s/
    ├── backend.yml
    ├── configmaps.yml
    ├── frontend.yml
    ├── ingress.yml
    ├── mongo.yml
    ├── mysql.yml
    ├── namespace.yml
    ├── redis.yml
    └── secrets.yml
sdk/
    ├── index.js
    └── package.json
README.md
```

---

# 🎯 Demo: Creating Your First API

```javascript
import { ReqNest } from '@reqnest/client'
const api = new ReqNest('your-api-key')

await api.blogPosts.create({
  title: "Hello World!",
  content: "Welcome to ReqNest!"
})
```

---

# 🧪 Health Checks

### Frontend:

```
https://<ngrok>/config.js
```

### Backend:

```
https://<ngrok>/api/health
```

### OAuth:

```
https://<ngrok>/oauth2/authorization/google
```

---

# 📞 Support

Email: **[support@reqnest.com](mailto:support@reqnest.com)**
Discord: **[https://discord.gg/reqnest](https://discord.gg/reqnest)**

---

# 📄 License

MIT License © ReqNest

---

<div align="center">

### 🚀 Build APIs 10× Faster

[**Get Started →**](https://app.reqnest.com/signup)

</div>
```

---
