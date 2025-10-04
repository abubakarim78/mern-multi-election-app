# Multi-Election Application

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js) that allows users to create, manage, and participate in multiple elections. This project is designed as a teaching resource for students learning the MERN stack at Hackerboost Developer Hub. The goal of this project is to help students understand how to build a full-stack application by gradually implementing features.

It is not intended for production use, but for learning and demonstration purposes only.

---

## Features

* User authentication and authorization (JWT-based)
* Role-based access (admin, candidate, voter)
* Create and manage multiple elections
* Candidate registration and management
* Secure voting system (one vote per user per election)
* Real-time vote counting and results display
* Responsive UI built with React and TailwindCSS
* RESTful API backend with Node.js and Express
* MongoDB database for scalable data storage

---

## Tech Stack

**Frontend**

* React
* React Router
* TailwindCSS / CSS Modules
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT)
* Bcrypt for password hashing

**Development Tools**

* Git & GitHub
* Postman (API testing)
* ESLint & Prettier (code formatting)

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (>= 16)
* npm or yarn
* MongoDB (local or cloud via MongoDB Atlas)
* Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sahadevgh/mern-multi-election-app.git
   cd mern-multi-election-app
   ```

2. Install dependencies for both client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Create a `.env` file in the `server` folder and add:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Start the development servers:

   * Backend:

     ```bash
     cd server
     npm run dev
     ```
   * Frontend:

     ```bash
     cd client
     npm start
     ```

5. Open the application at:

   ```
   http://localhost:3000
   ```

---

## Project Structure

```
mern-multi-election-app/
│
├── client/            # React frontend
├── server/            # Express backend
├── README.md          # Documentation
└── package.json       # Project metadata
```

---

## Contributing

This project is primarily for teaching purposes. Students are welcome to fork the repository, experiment, and submit pull requests. Please follow good Git commit practices and include clear commit messages.

---

## License

This project is open source and available under the [MIT License](LICENSE).
