# Curiofy -- A Modern Blog Platform

Curiofy is a full-stack blog platform built with the **MERN stack**,
designed for creators who value curiosity and creativity. It features a
secure admin dashboard, dynamic blog categories, and an integrated **AI
assistant** to help readers dive deeper into topics.

------------------------------------------------------------------------

### 🔗 Live Demo

![Curiofy Screenshot](https://github.com/user-attachments/assets/712095ef-2da3-4e10-9e96-20bd07c1e54c)\
🌐 [curiofy.onrender.com](https://curiofy.onrender.com)

------------------------------------------------------------------------

### 🔍 Overview

-   **Owner Login**\
![Owner Login Screenshot](https://github.com/user-attachments/assets/15ecbb7a-8191-4d51-9da4-92d7bc75fa69)\

-   **Owner Register**\
![Owner Register Screenshot](https://github.com/user-attachments/assets/3ea54cec-b9cd-4a67-91f1-d46bd494a693)\

-   **Create Blog**\
![Create Blog Screenshot](https://github.com/user-attachments/assets/815512cb-856f-4f45-9dd1-079f21de546a)\

-   **Update Blog**\
![Update Blog Screenshot](https://github.com/user-attachments/assets/dbf9c721-07e9-4097-832c-3e22ee69b850)\

-   **Update Owner Info**\
![Update Owner Info Screenshot](https://github.com/user-attachments/assets/7224df20-ddac-4c83-b8c2-8347ad64f627)\


------------------------------------------------------------------------

### ✨ Features

-   **Full CRUD Functionality** -- Create, read, update, and delete blog
    posts\
-   **Secure Admin Panel** -- JWT-based login for content management\
-   **Rich Text Editor** -- Modern blog writing with React Quill\
-   **Dynamic Categories** -- Blogs organized for easy discovery\
-   **AI-Powered Q&A** -- Google Gemini answers user queries about\
    posts\
-   **SEO Optimized** -- Dynamic titles and meta tags using Helmet\
-   **Smooth Animations** -- GSAP-enhanced UI transitions\
-   **Responsive Design** -- Mobile-friendly and fast

------------------------------------------------------------------------

### 🛠️ Tech Stack

**Frontend:** 
- React 18 + Vite 
- Tailwind CSS 
- React Router 
- ReactQuill (Editor) 
- GSAP (Animations) 
- React Helmet Async (SEO)

**Backend:** 
- Node.js + Express.js 
- MongoDB Atlas + Mongoose 
- JWT + Bcrypt for Auth

**APIs & Services:** 
- Google Gemini API 
- UptimeRobot (Keep-alive) 
- Google Search Console

**Deployment:** 
- Render (Frontend + Backend)

------------------------------------------------------------------------

### 🧑‍💻 Local Setup

#### Backend

``` bash
cd server
npm install
```

Create `.env` file in `server/`:

    MONGO_URI=your_mongodb_connection_string
    JWT_KEY=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key

Start server:

``` bash
npm run dev
```

#### Frontend

``` bash
cd client
npm install
npm run dev
```

App runs at: <http://localhost:5173>

------------------------------------------------------------------------

### 👤 About the Project

Originally built solo over 2--3 months as a personal learning and
showcase project. Later adapted for college group submission.
