# ProfitPath - Hidden Cost & Revenue Leak Finder

ProfitPath is a comprehensive business analytics platform that helps businesses identify hidden costs and revenue leaks through AI-powered analysis of their financial data. This is a **fully functional, production-ready application** with real database integration, authentication, and API endpoints.

## 🚀 Features

- **Real-time Analytics Dashboard**: Monitor key metrics like profit margins, revenue trends, and cost savings
- **Profit Opportunity Detection**: AI-powered identification of potential savings and revenue optimization
- **Integration Management**: Connect with QuickBooks, Xero, Shopify, and Stripe
- **Automated Reports**: Generate monthly "Profit Rescue Reports" with actionable insights
- **User Authentication**: Secure JWT-based login and registration system
- **Database Integration**: PostgreSQL with Prisma ORM for data persistence
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production Ready**: Deployable to Vercel with proper environment configuration

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Custom JWT-based auth system with bcrypt
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with proper error handling
- **Deployment**: Vercel-ready with environment variables

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd profitpath
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Create .env.local file
DATABASE_URL="postgresql://username:password@localhost:5432/profitpath"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
```

4. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Set up sample data
node scripts/setup-db.js
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 🔐 Demo Credentials

- **Email**: demo@profitpath.com
- **Password**: demo123

## 📁 Project Structure

```
profitpath/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── analytics/     # Analytics data endpoints
│   │   └── integrations/  # Integration management
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   ├── signup/           # Registration pages
│   └── globals.css       # Global styles
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── scripts/              # Database setup scripts
├── public/               # Static assets
└── middleware.ts         # Authentication middleware
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth` - Login/Signup with JWT token
- `DELETE /api/auth` - Logout (clears JWT cookie)

### Analytics
- `GET /api/analytics?type=overview` - Get user analytics data
- `POST /api/analytics` - Save analytics data or generate reports

### Integrations
- `GET /api/integrations` - Get user's connected integrations
- `POST /api/integrations` - Connect/disconnect/sync integrations

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

3. **Set environment variables in Vercel dashboard:**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="production"
```

4. **Deploy!** Vercel will automatically build and deploy your application.

### Database Setup for Production

1. **Set up PostgreSQL database** (Vercel Postgres, Supabase, or any PostgreSQL provider)

2. **Run database migrations:**
```bash
npx prisma db push
```

3. **Set up initial data:**
```bash
node scripts/setup-db.js
```

### Environment Variables

**Required for production:**

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Environment
NODE_ENV="production"
```

**Optional (for real integrations):**
```env
# QuickBooks
QUICKBOOKS_CLIENT_ID="your-quickbooks-client-id"
QUICKBOOKS_CLIENT_SECRET="your-quickbooks-client-secret"

# Xero
XERO_CLIENT_ID="your-xero-client-id"
XERO_CLIENT_SECRET="your-xero-client-secret"

# Shopify
SHOPIFY_API_KEY="your-shopify-api-key"
SHOPIFY_API_SECRET="your-shopify-api-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

## 🔧 Development

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### Adding New Features

1. **Database Schema**: Update `prisma/schema.prisma`
2. **API Routes**: Add new endpoints in `app/api/`
3. **Frontend**: Create new pages in `app/`
4. **Types**: Update `lib/types.ts` for new interfaces

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Authentication**: JWT token validation with middleware
- **API Validation**: Proper error responses and status codes
- **Database**: Prisma ORM with type safety
- **Frontend**: Form validation and error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **HTTP-only Cookies**: Secure cookie storage
- **Middleware Protection**: Route protection with authentication
- **Input Validation**: Server-side validation for all inputs

## 📊 Database Schema

The application uses a comprehensive database schema with:

- **Users**: Authentication and profile data
- **Integrations**: Third-party service connections
- **Analytics**: User analytics and reports
- **Profit Opportunities**: Identified savings opportunities
- **Alerts**: System notifications
- **Subscriptions**: SaaS subscription tracking
- **Products**: Product performance data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: muhammadhanan23230@gmail.com
- **Issues**: Create an issue in the repository
- **Documentation**: Check the inline code comments

## 🎯 Roadmap

- [ ] Real-time data synchronization
- [ ] Advanced AI analytics
- [ ] Mobile app
- [ ] Team collaboration features
- [ ] Advanced reporting
- [ ] API rate limiting
- [ ] Webhook support

---

**ProfitPath** - Making profit optimization accessible to every business! 🚀
