# 📢 Notification System Frontend

## 🚀 Overview

This project is a **React-based Notification System** that fetches and displays notifications from a protected API. It supports prioritization, filtering, search, and read/unread functionality, along with integrated logging middleware.

---

## ✨ Features

### 🔹 1. All Notifications

* Displays all notifications from API
* Supports pagination (page & limit)
* Responsive UI (mobile + desktop)

### 🔹 2. Priority Notifications

* Shows **Top 10 notifications**
* Sorting logic:

  * Placement (High Priority)
  * Result (Medium Priority)
  * Event (Low Priority)
* Further sorted by latest timestamp

### 🔹 3. Filter Notifications

* Filter by:

  * Event
  * Result
  * Placement
* Dynamic count of each category

### 🔹 4. Search Functionality

* Search notifications by message
* Case-insensitive filtering

### 🔹 5. Read / Unread System

* Notifications marked as unread by default
* Click to mark as read
* UI updates accordingly

### 🔹 6. Logging Middleware

* Custom reusable logging function:

  * Logs API success
  * Logs API errors
  * Logs user interactions
* Sends logs to evaluation service

---

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript)
* **UI Library:** Material UI
* **HTTP Client:** Axios
* **State Management:** React Hooks
* **Logging:** Custom middleware

---

## 🔐 Environment Variables

Create a `.env` file inside `notification_app_fe/`:

```
REACT_APP_TOKEN=your_access_token_here
```

> ⚠️ Do NOT commit `.env` file to GitHub

---

## 📂 Project Structure

```
RA2311003030263/
│
├── logging_middleware/
│   └── logger.js
│
├── notification_app_fe/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── config.ts
│   │   └── App.tsx
│   │
│   ├── .env
│   └── package.json
│
├── notification_system_design.md
└── README.md
```

---

## ⚙️ Setup & Run

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/YOUR_ROLL.git
cd YOUR_ROLL/notification_app_fe
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Add environment variables

Create `.env` file and add your token

### 4️⃣ Run the app

```
npm start
```

👉 App runs at:
http://localhost:3000

---

## 📸 Screenshots

* All Notifications Page
* Priority Notifications Page
* Filter Page
* Mobile Responsive View

*(Add screenshots here before submission)*

---

## 🎥 Demo Video

*(Attach your demo video link here)*

---

## ⚠️ Important Notes

* No sensitive data (token, clientSecret) is committed
* Logging middleware is integrated as required
* API calls include Authorization headers
* Code follows clean and modular structure

---

## ✅ Evaluation Checklist

* ✔ API integration working
* ✔ Priority sorting implemented
* ✔ Filtering functionality
* ✔ Read/Unread feature
* ✔ Logging middleware
* ✔ Responsive UI

---

## 👩‍💻 Author
* Roll Number: **RA2311003030263**

---

## 📄 License

This project is created for evaluation purposes.
