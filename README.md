# Next.js Scheduler - Google Calendar Integration

A full-stack scheduling application built with Next.js that allows sellers to connect their Google Calendar and buyers to book appointments. Features real-time calendar integration, automatic Google Meet links, and seamless appointment management.

## 🚀 Features

- **Dual User Roles**: Separate interfaces for Sellers and Buyers
- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **Real-time Calendar Integration**: Syncs with Google Calendar for availability
- **Automatic Meeting Links**: Google Meet integration for virtual meetings
- **Responsive Design**: Works on desktop and mobile devices
- **Database Persistence**: Stores appointments and user data securely
- **Encrypted Token Storage**: Secure handling of Google refresh tokens

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Calendar API**: Google Calendar API
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **PostgreSQL** database
3. **Google Cloud Console** project with Calendar API enabled
4. **Vercel** account for deployment

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd nextjs-scheduler
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (production)
6. Copy your Client ID and Client Secret

### 4. Database Setup

Create a PostgreSQL database and note the connection string:

```
postgresql://username:password@host:port/database
```

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_string_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Encryption key for storing refresh tokens (32 bytes hex string)
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Vercel (for production)
VERCEL_URL=https://your-vercel-domain.vercel.app
```

### 6. Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🚀 Deployment to Vercel

### 1. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### 2. Configure Environment Variables

In your Vercel dashboard, add all environment variables from your `.env.local` file.

### 3. Update Google OAuth Settings

Add your Vercel domain to the Google OAuth authorized redirect URIs:
```
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

## 📱 How to Use

### For Sellers:

1. **Sign Up**: Go to `/seller` and sign in with Google
2. **Grant Permissions**: Allow calendar access during OAuth flow
3. **Setup Complete**: Your Google Calendar is now connected
4. **View Appointments**: Check `/seller/appointments` for bookings

### For Buyers:

1. **Browse Sellers**: Go to `/buyer` and sign in with Google
2. **Select Seller**: Choose from available sellers
3. **Pick Time Slot**: Select date and available time
4. **Book Appointment**: Fill in details and confirm booking
5. **Join Meeting**: Use Google Meet link when appointment time arrives

## 🏗️ Project Structure

```
nextjs-scheduler/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── appointments/
│   │   ├── availability/
│   │   ├── sellers/
│   │   └── seller/role/
│   ├── buyer/
│   │   ├── appointments/
│   │   └── book/[sellerId]/
│   ├── seller/
│   │   └── appointments/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── encryption.ts
│   └── googleCalendar.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
└── README.md
```

## 🔐 Security Features

- **Encrypted Token Storage**: Google refresh tokens are encrypted before database storage
- **Session Management**: Secure session handling with NextAuth.js
- **API Protection**: All API routes are protected with authentication
- **HTTPS Enforcement**: Secure data transmission in production

## 🧪 API Endpoints

- `GET /api/sellers` - List all available sellers
- `GET /api/availability` - Get seller's available time slots
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment
- `POST /api/seller/role` - Update user role to seller


