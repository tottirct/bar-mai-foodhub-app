 BAR MAI FOODHUB

> Bar Mai Canteen Food Hub — An All-in-One Online Food Ordering System

Bar Mai FoodHub is a web application for managing a university canteen, allowing customers to order food online, pay via E-Wallet, and track order statuses in real time. It also includes a shop management system for shop owners and an admin dashboard for system administrators.

---

## Key Features

### Customer
- Browse all shops and menus in the food court
- Order food with add-ons / extra options and special notes
- Shopping cart (Trolley) for collecting order items
- E-Wallet system for top-up and payment
- View order history and order status
- View personal profile

### Shop Owner
- Manage shop profile (name, description, image)
- Add / edit / delete menu items with photos
- Manage menu options (add-ons) for each item
- Open / close shop and toggle menu availability
- Receive and manage customer orders
- View transaction history and withdraw funds

### Admin
- System overview dashboard with Activity Log
- Manage all users (view details, ban/unban)
- Manage all shops (view details, ban/unban, add shops)
- View user and shop transaction details

---

## Tech Stack

| Technology | Description |
|---|---|
| **Next.js 16** | React Framework (App Router) |
| **React 19** | UI Library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS Framework |
| **Prisma ORM** | Database ORM (Multi-provider) |
| **MySQL 8.0** | Relational Database (Core Data) |
| **MongoDB** | Document Database (Order Details & Activity Log) |
| **NextAuth.js** | Authentication |
| **Cloudinary** | Image Upload & Management |
| **bcrypt.js** | Password Hashing |
| **Lucide React** | Icon Library |
| **Docker Compose** | Container Orchestration (Databases) |

---

## Database Architecture

This project uses a **Dual-Database Architecture** powered by Prisma ORM:

### MySQL — Structured / Relational Data
- `User` — User accounts (Customer / Owner / Admin)
- `Wallet` — Electronic wallet
- `Shop` — Shop information
- `Menu` — Food menu items
- `MenuOption` — Menu add-on options
- `Order` — Order header

### MongoDB — Document Data
- `OrderDetail` — Order details (Items, Add-ons, Notes)
- `ActivityLog` — System activity audit trail

```
┌────────────────────────────────────────┐
│              Next.js App               │
│          (App Router + API)            │
├──────────────────┬─────────────────────┤
│   Prisma MySQL   │   Prisma MongoDB    │
│   Client         │   Client            │
├──────────────────┼─────────────────────┤
│   MySQL 8.0      │   MongoDB           │
│   ─────────────  │   ───────────────   │
│   User           │   OrderDetail       │
│   Wallet         │   ActivityLog       │
│   Shop           │                     │
│   Menu           │                     │
│   MenuOption     │                     │
│   Order          │                     │
└──────────────────┴─────────────────────┘
```

---

## Project Structure

```
bar-mai-foodhub-app/
├── prisma/
│   ├── schema.mysql.prisma      # MySQL Schema
│   ├── schema.mongo.prisma      # MongoDB Schema
│   └── generated/               # Generated Prisma Clients
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing Page
│   │   ├── layout.tsx           # Root Layout
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/            # NextAuth Endpoints
│   │   │   ├── users/           # User Management API
│   │   │   ├── shops/           # Shop & Menu API
│   │   │   ├── orders/          # Order API
│   │   │   ├── admins/          # Admin API
│   │   │   ├── menus/           # Menu API
│   │   │   └── upload/          # Image Upload API
│   │   ├── customer/            # Customer Pages
│   │   │   ├── [id]/            # Shop Detail
│   │   │   ├── credit/          # E-Wallet / Credit
│   │   │   ├── information/     # User Profile
│   │   │   └── trolley/         # Shopping Cart
│   │   ├── owner/               # Owner Pages
│   │   │   ├── menus/           # Menu Management
│   │   │   ├── transactions/    # Transaction History
│   │   │   └── information/     # Owner Profile
│   │   └── admin/               # Admin Pages
│   │       ├── shops/           # Shop Management
│   │       └── users/           # User Management
│   ├── components/              # Reusable Components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── customer/            # Customer Components
│   │   ├── owner/               # Owner Components
│   │   └── admin/               # Admin Components
│   ├── lib/                     # Utilities & DB Clients
│   └── types/                   # TypeScript Type Definitions
├── docker-compose.yml           # MySQL + MongoDB Containers
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for databases)
- [Cloudinary Account](https://cloudinary.com/) (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/tottirct/bar-mai-foodhub-app.git
cd bar-mai-foodhub-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the project root:

```env
# MySQL
MYSQL_DATABASE_URL="mysql://root:password123@localhost:3306/bar_mai_db"

# MongoDB
MONGO_DATABASE_URL="mongodb://admin:password123@localhost:27017/bar_mai_mongo?authSource=admin"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Start Databases with Docker

```bash
docker-compose up -d
```

This will create:
- **MySQL 8.0** — Port `3306`
- **MongoDB** — Port `27017`

### 5. Generate Prisma Clients & Migrate

```bash
# Generate Prisma Clients (MySQL + MongoDB)
npx prisma generate --schema=prisma/schema.mysql.prisma
npx prisma generate --schema=prisma/schema.mongo.prisma

# Push schema to MySQL
npx prisma db push --schema=prisma/schema.mysql.prisma
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributors

This project was developed by a team of students as part of a Database course.

---

## License

This project is for educational purposes.
message.txt