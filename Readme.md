

# Basic Registration & Login App (React + Express + MongoDB)

This is a basic full-stack registration and login app built with:

- **Frontend:** React (default `Vite + React` structure)
- **Backend:** Express.js (`server.js`)
- **Database:** MongoDB (using `MongoClient`)
- **HTTP Client:** Axios

> ⚠️ **Disclaimer:** This project is for learning/demo purposes only. It does **not** implement password hashing, authentication tokens, or secure session management.

---





## 🚀 Features

- Basic registration form (username, email, password)
- Basic login form (email, password)
- Axios handles communication between frontend and backend
- MongoDB stores user data (no hashing or encryption)

---

## 🧰 Tech Stack

- React
- Express.js
- MongoDB (via `mongodb` package, using `MongoClient`)
- Axios
- Nodemon / Concurrently for development (`npm run dev`)

---


## 🏃 Running the App

Start backend using:
```bash
npm i
npm run dev
```
Start both the frontend using:

```bash
cd registrationLogin
npm i
npm run dev
```
This will:

* Start the **Express backend** (typically on port `3000`)
* Start the **React frontend** (on port `5173`)

---

## 📌 Notes

* No password hashing — passwords are stored as plain text (not safe for real use).
* No authentication (JWT, cookies, etc.).
* No form validation.
* Intended only as a learning or demo scaffold.

---

## 🙋 Contributions Welcome!

Feel free to fork and extend this project — add hashing, JWT, form validation, UI enhancements, etc.


