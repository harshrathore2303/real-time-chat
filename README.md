# 💬 Real-Time Chat App

A real-time messaging application that connects users instantly via WebSockets. Users can chat only with other users who are currently online. This application aims to simulate live, secure conversations, making it ideal for real-time social interaction scenarios.

## 📖 Description

This Real-Time Chat App enables users to register, log in, and message other users who are currently active. It uses the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO** for real-time communication.

### Why These Technologies?

* **React** for dynamic and responsive user interface
* **Tailwind CSS** and **DaisyUI** for clean and modern UI styling
* **Zustand** for global state management
* **Node.js** and **Express** to power the backend API
* **MongoDB Atlas** for robust cloud-based data storage
* **Socket.IO** to handle WebSocket-based live messaging
* **Cloudinary** for image sharing in chats

### Challenges Faced

* Managing socket lifecycle on authentication and logout
* Ensuring message persistence with MongoDB
* Handling image uploads in real time

### Future Improvements

* Email verification
* Randomly chat with strangers
* Dark/light mode toggle

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Installation](#-installation)
3. [Usage](#-how-to-use)
4. [Screenshots](#-screenshots)
5. [Credits](#-credits)
6. [License](#-license)

---

## ✨ Features

* 🟢 Display only online users for conversation
* 🔐 Secure login/signup using JWT
* 🔄 Real-time chat powered by WebSocket
* 🖼️ Image messaging (uploads handled via Cloudinary)
* 💾 Message history saved in MongoDB
* 🎨 Responsive and modern UI

---

## 💾 Installation

```bash
# Clone the repository
git clone https://github.com/harshrathore2303/real-time-chat.git
cd real-time-chat

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## 🚦 How to Use

### 🖥️ Running Locally

```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm run dev
```

### 🔐 Required .env Configuration (Inside /server/.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🤝 Contributions

If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit (`git commit -m 'Add feature'`)
5. Push (`git push origin feature-name`)
6. Submit a Pull Request 🙌

---

## ✅ Tests

Currently, no test scripts are implemented. Future updates will include unit and integration tests for API and UI components.

---

> Keep checking back for updates and improvements. Happy Coding! 🚀
