# 🚀 TrackJob – AI-Powered Job Application Tracker

TrackJob is a full-stack MERN application that helps job seekers organize, monitor, and manage their job applications in one place. It provides a clean dashboard for tracking application status, uploading resumes, and managing the entire job search process efficiently.

---

## 📌 Features

- 🔐 User Authentication (Login & Signup)
- 👤 Secure User Dashboard
- 💼 Add, Edit, and Delete Job Applications
- 📄 Resume Upload & Management
- 📊 Track Application Status
  - Applied
  - Interview
  - Offered
  - Rejected
- 🔍 Search and Filter Jobs
- 📱 Responsive UI
- ⚡ Fast REST API with Express.js
- 🗄️ MongoDB Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Upload)

---

## 📂 Project Structure

```
TrackJob/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Anshika31102006/TrackJob.git
cd TrackJob
```

---

### Install Frontend Dependencies

```bash
cd client
npm install
```

---

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

> Never commit your `.env` file to GitHub.

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm start
```

or

```bash
npm run dev
```

---

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🌐 Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5001
```

---

## 📸 Screenshots

Add screenshots of your project here.

Example:

```
screenshots/
    dashboard.png
    login.png
    signup.png
```

---

## 📈 Future Enhancements

- AI Resume Analysis
- Job Recommendation System
- Email Notifications
- Interview Preparation Assistant
- Analytics Dashboard
- Dark Mode
- Calendar Integration

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Anshika Sharma**

GitHub: https://github.com/Anshika31102006

LinkedIn: *(Add your LinkedIn profile link here)*

---

⭐ If you like this project, don't forget to give it a **Star** on GitHub!
