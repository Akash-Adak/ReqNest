<div align="center">

# 🚀 ReqNest

### *Transform Ideas into Production APIs in Minutes*

[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)](https://github.com/reqnest/platform)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)](https://app.reqnest.com)
[![PRs](https://img.shields.io/badge/PRs-welcome-blue?style=for-the-badge)](CONTRIBUTING.md)

[Get Started](https://app.reqnest.com/signup) • [Documentation](https://docs.reqnest.com) • [Discord](https://discord.gg/reqnest)

</div>

---

## 🌟 What is ReqNest?

**ReqNest** is a cloud-native backend automation platform that converts data models into **fully functional production APIs** in minutes.

> **Think:** Vercel + Firebase + Postman + Swagger → Combined for Backend APIs

<div align="center">

```mermaid
graph LR
    A[💡 Idea] --> B[🧠 AI Schema]
    B --> C[⚡ API Generation]
    C --> D[🚀 Production Ready]
    style A fill:#667eea
    style B fill:#764ba2
    style C fill:#f093fb
    style D fill:#4facfe
```

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🧠 **AI-Powered Schema Builder**
Convert plain English descriptions into optimized database schemas instantly.

</td>
<td width="50%">

### ⚡ **Instant API Generation**
REST, GraphQL, and WebSocket endpoints auto-generated from your schema.

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ **Enterprise Security**
OAuth2, JWT, RBAC, CORS protection, and intelligent rate limiting built-in.

</td>
<td width="50%">

### 📱 **Auto-Generated SDKs**
Client libraries for React, Vue, Flutter, Node, Java, Python, and Go.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client
        A[React Frontend]
    end
    subgraph Infrastructure
        B[Nginx Ingress]
        C[Ngrok HTTPS]
    end
    subgraph Backend
        D[Spring Boot API]
    end
    subgraph Data Layer
        E[(MySQL)]
        F[(MongoDB)]
        G[(Redis Cache)]
    end
    
    A -->|HTTPS| C
    C --> B
    B -->|/api| D
    B -->|/oauth2| D
    D --> E
    D --> F
    D --> G
    
    style A fill:#61dafb
    style D fill:#6db33f
    style E fill:#4479a1
    style F fill:#47a248
    style G fill:#dc382d
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white) ![Java](https://img.shields.io/badge/-Java%2017-007396?style=flat-square&logo=java&logoColor=white) |
| **Databases** | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) |
| **Infrastructure** | ![Kubernetes](https://img.shields.io/badge/-Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=nginx&logoColor=white) |

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
Docker • Kubernetes (Kind) • Node.js 18+ • Java 17+ • Ngrok
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/reqnest/platform.git
cd reqnest-platform
```

### 2️⃣ Deploy Infrastructure

```bash
# Install Ingress Controller
kubectl apply -f ingress-nginx/install.yaml

# Deploy all services
kubectl apply -f k8s/

# Expose via Ngrok
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
ngrok http http://localhost:8080
```

### 3️⃣ Configure OAuth

Update Google Cloud Console with your Ngrok URL:

```
Authorized redirect URIs:
https://<your-ngrok-url>.ngrok-free.app/login/oauth2/code/google

Authorized JavaScript origins:
https://<your-ngrok-url>.ngrok-free.app
```

### 4️⃣ Update ConfigMaps

```bash
# Update frontend and backend configs with Ngrok URL
kubectl edit configmap frontend-config -n reqnest
kubectl edit configmap backend-config -n reqnest

# Restart deployments
kubectl rollout restart deployment/frontend -n reqnest
kubectl rollout restart deployment/backend -n reqnest
```

---

## 💻 Usage Example

```javascript
import { ReqNest } from '@reqnest/client'

const api = new ReqNest('your-api-key')

// Create a resource
await api.blogPosts.create({
  title: "Hello World!",
  content: "Welcome to ReqNest!"
})

// Query with filters
const posts = await api.blogPosts.find({
  where: { status: 'published' },
  orderBy: { createdAt: 'desc' }
})
```

---

## 📁 Project Structure

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

## 🔒 Security Features

- 🔐 **OAuth2 Integration** - Google login with secure token exchange
- 🎫 **JWT Authentication** - Stateless session management
- 🚦 **Rate Limiting** - Redis-backed request throttling
- 🛡️ **CORS Protection** - Configurable origin policies
- 🔑 **RBAC** - Role-based access control

---

## 🧪 Health Checks

| Service | Endpoint |
|---------|----------|
| Frontend Config | `https://<ngrok-url>/config.js` |
| Backend Health | `https://<ngrok-url>/api/health` |
| OAuth Flow | `https://<ngrok-url>/oauth2/authorization/google` |
| Redis Status | Check backend logs or `/api/redis/health` |

---

## 📊 Ingress Routing

```yaml
/api          → backend:8080    # REST API endpoints
/oauth2       → backend:8080    # OAuth2 flows
/login/oauth2 → backend:8080    # OAuth2 callbacks
/             → frontend:80      # React app
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📞 Support

<div align="center">

📧 **Email:** [support@reqnest.com](mailto:support@reqnest.com)

💬 **Discord:** [Join our community](https://discord.gg/reqnest)

📚 **Docs:** [docs.reqnest.com](https://docs.reqnest.com)

</div>

---

## 📄 License

MIT License © 2024 ReqNest

See [LICENSE](LICENSE) for more information.

---

<div align="center">

### 🚀 **Build APIs 10× Faster**

[**Get Started →**](https://app.reqnest.com/signup)

---

⭐ **Star us on GitHub** — it motivates us a lot!

[![GitHub stars](https://img.shields.io/github/stars/reqnest/platform?style=social)](https://github.com/reqnest/platform)

</div>
