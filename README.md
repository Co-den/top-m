# 💰 Top Mart - Investment & Referral Platform

![Top Mart Banner](https://via.placeholder.com/1200x400/e81d78/ffffff?text=Top+Mart+-+Investment+Platform)

> A comprehensive financial investment platform that enables users to invest in various investment plans and earn automated daily returns with a powerful referral system.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://top-m-gvue.vercel.app)
[![Backend](https://img.shields.io/badge/api-deployed-blue)](https://top-mart-api.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Top Mart** is a modern financial platform that combines investment management with a viral referral system. Users can invest in various plans, earn automated daily returns, and build passive income while growing their network through referrals.

### Key Highlights

- 🤖 **Automated Daily Returns** - Cron-based system credits returns at midnight UTC
- 👥 **Viral Referral System** - Earn ₦1,000 for every successful referral
- 📊 **Real-time Analytics** - Track investments and referral earnings
- 🔐 **Secure & Scalable** - JWT authentication with MongoDB
- 📱 **Mobile Responsive** - Beautiful UI built with Next.js and Tailwind CSS

---

## ✨ Features

### 💰 Investment System

- **Multiple Investment Plans**: Various plans with different ROI and durations
- **Automated Daily Returns**: Cron jobs credit returns daily at 12:01 AM UTC
- **Real-time Tracking**: Monitor active investments, earnings, and total returns
- **Investment Dashboard**: Comprehensive admin panel for oversight
- **Catch-up Processing**: Recover missed returns if server was down

### 👥 Referral Program

- **Unique Referral Codes**: Auto-generated 6-character codes (e.g., "ABC123")
- **Instant Bonuses**: ₦1,000 credited immediately when someone uses your code
- **Referral Analytics**: Track total referrals, earnings, and referred users
- **Shareable Links**: Pre-formatted links for easy social sharing
- **Withdrawal System**: Transfer referral bonus to main account balance

### 🔐 Security & Authentication

- **JWT Authentication**: Secure token-based auth with HTTP-only cookies
- **Password Hashing**: Bcrypt with cost factor 12
- **Email Verification**: 10-minute token expiration
- **Role-Based Access**: User and Admin roles with permission control
- **Input Validation**: Comprehensive request validation and sanitization

### 📊 Admin Dashboard

- **Investment Management**: View, filter, and manage all investments
- **User Management**: Complete control over user accounts
- **Referral Statistics**: System-wide analytics and top referrers
- **Manual Controls**: Trigger returns processing and catch-up operations
- **Detailed Logging**: Monitor all system activities

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server runtime and web framework |
| MongoDB + Mongoose | Database and ODM |
| JWT + Bcrypt | Authentication and password hashing |
| Node-cron | Scheduled task automation |
| Nodemailer | Email notifications |
| Axios | HTTP client |
| Dotenv | Environment configuration |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animation library |
| Axios | API requests |
| Lucide React | Icon library |

### DevOps

| Service | Purpose |
|---------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| MongoDB Atlas | Cloud database |
| Cron-job.org | External cron service |
| GitHub | Version control |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)
- SMTP credentials for emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/top-mart.git
   cd top-mart
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Backend `.env`:
   ```env
   # Server
   PORT=8000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/topmart
   
   # JWT
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES=7d
   JWT_COOKIE_EXPIRES_IN=7
   
   # Admin JWT (if separate)
   ADMIN_JWT_SECRET=your_admin_secret_key
   ADMIN_JWT_EXPIRES=7d
   ADMIN_COOKIE_EXPIRES_IN=7
   
   # Cron Secret
   CRON_SECRET=your_cron_secret_key
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

   Frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "08012345678",
  "password": "password123",
  "confirmPassword": "password123",
  "referralCode": "ABC123" // Optional
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "08012345678",
  "password": "password123"
}
```

### Investment Endpoints

```http
# Create Investment
POST /api/investments
Authorization: Bearer <token>

{
  "planId": "plan_id_here",
  "depositAmount": 100000
}
```

```http
# Get User's Investments
GET /api/investments/my-investments
Authorization: Bearer <token>
```

```http
# Process Daily Returns (Admin)
POST /api/investments/process-returns
Authorization: Bearer <admin_token>
```

### Referral Endpoints

```http
# Get Referral Info
GET /api/referrals/my-referrals
Authorization: Bearer <token>
```

```http
# Validate Referral Code (Public)
GET /api/referrals/validate/:code
```

```http
# Withdraw Referral Bonus
POST /api/referrals/withdraw-bonus
Authorization: Bearer <token>

{
  "amount": 5000
}
```

---

## 📁 Project Structure

```
top-mart/
├── backend/
│   ├── config/
│   │   └── config.env
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── investmentController.js
│   │   ├── adminController.js
│   │   └── referralController.js
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── AccountModel.js
│   │   ├── InvestmentModel.js
│   │   └── PlanModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── investmentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── referralRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── cron/
│   │   └── investmentCron.js
│   ├── utils/
│   │   ├── email.js
│   │   └── logger.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── home/
│   │   ├── investments/
│   │   ├── referral/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── bottom-nav.tsx
│   │   └── ui/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   └── package.json
│
└── README.md
```

---

## 🌐 Deployment

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure environment variables
4. Deploy with auto-deploy enabled

**Build Command**: `npm install`  
**Start Command**: `node server.js`

### Frontend (Vercel)

1. Import project to Vercel
2. Configure environment variables
3. Deploy with automatic deployments

### External Cron Setup (cron-job.org)

1. Create account on cron-job.org
2. Add two cron jobs:
   - **Keep Alive**: Every 10 minutes → `GET /api/health`
   - **Process Returns**: Daily at 00:01 UTC → `POST /api/investments/cron-trigger?secret=YOUR_SECRET`

---

## 🔧 Configuration

### Investment Plans

Create investment plans via admin panel or directly in MongoDB:

```javascript
{
  name: "Starter Plan",
  minInvestment: 10000,
  maxInvestment: 100000,
  dailyReturn: 5, // 5% daily
  duration: 30, // 30 days
  status: "active"
}
```

### Cron Schedule

The system runs two automated tasks:

1. **Health Check** (Every 10 minutes) - Keeps Render server awake
2. **Daily Returns** (12:01 AM UTC) - Credits returns to all active investments

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for frontend
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 🐛 Known Issues

- Email verification token expires in 10 minutes (by design)
- Render free tier causes cold starts (~30 seconds)
- First cron trigger may fail due to server hibernation (retry logic handles this)

---

## 📈 Roadmap

- [ ] Withdrawal system for investment returns
- [ ] Multi-currency support (USD, EUR, GBP)
- [ ] Investment performance charts
- [ ] Push notifications
- [ ] Social sharing integration
- [ ] Tier-based referral bonuses
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Two-factor authentication
- [ ] KYC verification

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Anthropic's Claude for development assistance
- Next.js team for the amazing framework
- MongoDB team for excellent documentation
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations

---

## 📧 Contact

For support or inquiries:

- **Email**: support@top-mart.shop
- **Website**: https://top-mart.shop
- **Twitter**: [@topmart](https://twitter.com/topmart)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Top Mart Team

</div>
