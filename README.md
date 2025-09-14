
# 📦 ReqNest – Dynamic API Platform

> **ReqNest** is a cloud-ready API platform that lets you **define APIs dynamically**, manage them through a modern dashboard, and consume them instantly using an auto-generated SDK.
> It combines a **Spring Boot backend**, a **React dashboard**, and a lightweight **JavaScript SDK** for seamless integration.

---

## 🚀 Features

* **Dynamic API Creation** – Define new APIs and schemas without redeploying backend.
* **SDK Auto-Generation** – Instantly get an NPM package (`reqnest-sdk`) to interact with your APIs.
* **Dashboard UI** – React + Tailwind + Vite based dashboard for managing APIs.
* **Secure Access** – API key–based authentication (JWT / future OAuth).
* **Extensible** – Backend built with Spring Boot, frontend in React, SDK in pure JS.

---

## 🏗️ Project Structure

```
ReqNest/
│── backend-engine/        # Spring Boot backend (API engine + schema manager)
│── dynamic-api-dashboard/ # React frontend for API management
│── sdk/                   # ReqNest JavaScript SDK (npm package)
│── README.md              # Project documentation (this file)
```

---

## 🔧 Tech Stack

* **Backend**: Java, Spring Boot, MySQL, Kafka (future integration)
* **Frontend**: React, Vite, Tailwind CSS
* **SDK**: Node.js, ES Modules, NPM package publishing
* **Infra (planned)**: Docker, Kubernetes, Redis, AWS

---

## ⚡ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Akash-Adak/ReqNest.git
cd ReqNest
```

### 2. Setup Backend

```bash
cd backend-engine
./mvnw spring-boot:run
```

Backend will run on **`http://localhost:8080`**.
It handles API definitions, schema storage, and request processing.

### 3. Setup Frontend Dashboard

```bash
cd ../dynamic-api-dashboard
npm install
npm run dev
```

Frontend will run on **`http://localhost:5173`**.
Login → Manage APIs → View schema.

### 4. Install SDK (for client apps)

```bash
npm install reqnest-sdk
```

---

## 📦 SDK Usage

```javascript
import ReqNestSDK from "reqnest-sdk";

// Initialize SDK
const sdk = new ReqNestSDK({
  baseUrl: "http://localhost:8080"
});

// Set API key explicitly
sdk.setApiKey("YOUR_API_KEY");

// Use a schema (example: users)
const usersApi = sdk.schema("users");

// Example CRUD
await usersApi.create({ name: "Akash", email: "akash@example.com" });

const list = await usersApi.list();
console.log("Users:", list);

await usersApi.update({ id: list[0].id, name: "Updated Name" });

await usersApi.delete({ id: list[0].id });
```

---

## 🖥️ Dashboard Preview

| Dashboard                                                        | API Schema                                                 | SDK Docs                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) | ![Schema](https://via.placeholder.com/300x200?text=Schema) | ![SDK](https://via.placeholder.com/300x200?text=SDK) |

*(Replace placeholders with real screenshots once ready)*

---

## 🔮 Roadmap

* [ ] Role-based access & authentication
* [ ] Schema versioning & rollback
* [ ] Kafka integration for async events
* [ ] Docker & Kubernetes deployment
* [ ] CI/CD setup with GitHub Actions
* [ ] Advanced analytics in dashboard

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push branch (`git push origin feature/YourFeature`)
5. Create a Pull Request

---

## 📜 License

MIT License © 2025 [Akash Adak](https://github.com/Akash-Adak)

---

## 📬 Contact

* GitHub: [@Akash-Adak](https://github.com/Akash-Adak)
* Email: *(add your contact here if you want)*

---
