# 🌍 Tourism Management System — MERN Stack

A college-level full-stack project built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 📁 Project Folder Structure

```
tourism-app/
├── backend/                  ← Node.js + Express API
│   ├── models/
│   │   ├── User.js           ← User schema
│   │   ├── Tour.js           ← Tour package schema
│   │   ├── Booking.js        ← Booking schema
│   │   └── Feedback.js       ← Feedback/rating schema
│   ├── routes/
│   │   ├── authRoutes.js     ← Register, Login
│   │   ├── tourRoutes.js     ← CRUD for tours
│   │   ├── bookingRoutes.js  ← Create/view bookings
│   │   └── feedbackRoutes.js ← Submit/view feedback
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect + admin check
│   ├── server.js             ← Main server file
│   ├── seed.js               ← Sample data script
│   ├── .env                  ← Environment variables
│   └── package.json
│
└── frontend/                 ← React.js App
    ├── public/
    │   └── index.html        ← Bootstrap 5 loaded here
    └── src/
        ├── context/
        │   ├── AuthContext.js ← Global login state
        │   └── api.js         ← Axios with auth token
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.js
        │   │   └── StarRating.js
        │   └── tours/
        │       └── TourCard.js
        ├── pages/
        │   ├── Home.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── ToursPage.js
        │   ├── TourDetailPage.js
        │   ├── BookingPage.js
        │   ├── MyBookingsPage.js
        │   ├── FeedbackPage.js
        │   ├── AdminDashboard.js
        │   ├── AdminTours.js
        │   ├── AdminBookings.js
        │   └── AdminFeedback.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have these installed:
- **Node.js** (v16 or higher) — https://nodejs.org
- **MongoDB** (running locally) — https://www.mongodb.com/try/download/community
- **npm** (comes with Node.js)

---

### Step 1: Set Up the Backend

```bash
# Go into the backend folder
cd tourism-app/backend

# Install all dependencies
npm install

# The .env file is already created. Verify it contains:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/tourismDB
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Step 2: Seed Sample Data (Optional but Recommended)

```bash
# While inside the backend folder, run:
node seed.js
```

This creates:
- **Admin account:** `admin@tour.com` / `admin123`
- **User account:** `john@example.com` / `user123`
- **6 sample tour packages**

### Step 3: Start the Backend Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR normal mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

---

### Step 4: Set Up the Frontend

Open a **new terminal window:**

```bash
# Go into the frontend folder
cd tourism-app/frontend

# Install all dependencies
npm install

# Start the React development server
npm start
```

The React app opens automatically at: **http://localhost:3000**

---

## 🗄️ MongoDB Collections Explained

### Users Collection
| Field     | Type   | Description                  |
|-----------|--------|------------------------------|
| name      | String | Full name of the user        |
| email     | String | Unique email (used for login)|
| password  | String | Hashed password (bcrypt)     |
| role      | String | 'user' or 'admin'            |
| phone     | String | Contact number               |

### Tours Collection
| Field          | Type   | Description                   |
|----------------|--------|-------------------------------|
| name           | String | Tour package name             |
| destination    | String | Location/destination          |
| price          | Number | Price per person (₹)          |
| duration       | Number | Duration in days              |
| description    | String | Detailed description          |
| availableSeats | Number | Remaining bookable seats      |
| image          | String | URL to tour image             |

### Bookings Collection
| Field       | Type     | Description                    |
|-------------|----------|--------------------------------|
| user        | ObjectId | Reference to User              |
| tour        | ObjectId | Reference to Tour              |
| travelers   | Number   | Number of travelers            |
| travelDate  | Date     | Chosen travel date             |
| totalPrice  | Number   | price × travelers              |
| status      | String   | confirmed / cancelled          |

### Feedback Collection
| Field   | Type     | Description              |
|---------|----------|--------------------------|
| user    | ObjectId | Reference to User        |
| tour    | ObjectId | Reference to Tour        |
| rating  | Number   | 1 to 5 stars             |
| comment | String   | Written review           |

---

## 🔌 API Endpoints Reference

### Auth Routes
| Method | Endpoint            | Access  | Description       |
|--------|---------------------|---------|-------------------|
| POST   | /api/auth/register  | Public  | Register new user |
| POST   | /api/auth/login     | Public  | Login             |
| GET    | /api/auth/profile   | Private | Get user profile  |

### Tour Routes
| Method | Endpoint        | Access | Description          |
|--------|-----------------|--------|----------------------|
| GET    | /api/tours      | Public | Get active tours     |
| GET    | /api/tours/all  | Admin  | Get all tours        |
| GET    | /api/tours/:id  | Public | Get single tour      |
| POST   | /api/tours      | Admin  | Create tour          |
| PUT    | /api/tours/:id  | Admin  | Update tour          |
| DELETE | /api/tours/:id  | Admin  | Delete tour          |

### Booking Routes
| Method | Endpoint                  | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| POST   | /api/bookings             | Private | Create booking       |
| GET    | /api/bookings/my          | Private | My booking history   |
| GET    | /api/bookings             | Admin   | All bookings         |
| PUT    | /api/bookings/:id/cancel  | Private | Cancel booking       |

### Feedback Routes
| Method | Endpoint                   | Access  | Description        |
|--------|----------------------------|---------|--------------------|
| POST   | /api/feedback              | Private | Submit feedback    |
| GET    | /api/feedback/tour/:tourId | Public  | Tour's feedback    |
| GET    | /api/feedback              | Admin   | All feedback       |
| DELETE | /api/feedback/:id          | Admin   | Delete feedback    |

---

## 🔐 How Authentication Works

1. User registers → password is **hashed with bcrypt** before saving
2. User logs in → server checks hashed password → returns a **JWT token**
3. Token is stored in **localStorage** in the browser
4. Every protected API request sends the token in the header: `Authorization: Bearer <token>`
5. Server verifies the token using `authMiddleware.js`

---

## 🎨 Technologies Used

| Technology    | Purpose                        |
|---------------|--------------------------------|
| MongoDB       | NoSQL database                 |
| Mongoose      | MongoDB object modeling (ODM)  |
| Express.js    | Backend web framework          |
| Node.js       | JavaScript runtime             |
| React.js      | Frontend UI library            |
| React Router  | Client-side page routing       |
| Axios         | HTTP requests from React       |
| Bootstrap 5   | CSS styling and components     |
| bcryptjs      | Password hashing               |
| JSON Web Token| User authentication            |
| dotenv        | Environment variable management|

---

## 💡 Common Issues & Solutions

**MongoDB not connecting?**
- Make sure MongoDB service is running: `mongod` (Linux/Mac) or start from Services (Windows)

**Port 5000 already in use?**
- Change `PORT=5001` in backend `.env` file

**CORS error in browser?**
- The `cors` package in server.js handles this. Make sure you're running backend on port 5000.

**Token not working?**
- Clear localStorage in browser DevTools → Application → Local Storage

---

*Built as a college project — Tourism Management System using MERN Stack*
