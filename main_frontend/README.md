# 🛍️ StyleStore - Modern E-commerce Platform

A full-featured e-commerce platform built with **Next.js 15**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. This project provides a complete online shopping experience with both customer-facing features and a comprehensive admin panel.

## 🌟 Features

### 🛒 **Customer Features**
- **Product Catalog**: Browse products by categories, subcategories, and subgroups
- **Advanced Search**: Search with filters for price, color, size, and more
- **Product Details**: Detailed product pages with image zoom and gallery
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete checkout flow with customer information
- **Payment Integration**: Stripe payment processing (simulated)
- **Order Management**: Order confirmation and success pages
- **Responsive Design**: Mobile-first responsive design

### 👨‍💼 **Admin Features**
- **Admin Authentication**: Secure login with token-based authentication
- **Product Management**: Full CRUD operations for products
- **Category Management**: Manage categories, subcategories, and subgroups
- **Order Management**: View and manage customer orders
- **Dashboard**: Admin overview with key metrics
- **Protected Routes**: Role-based access control

### 🎨 **UI/UX Features**
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Interactive Components**: Hover effects, animations, and transitions
- **Image Zoom**: Advanced product image viewing with zoom functionality
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: WCAG compliant with keyboard navigation

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component

### **Backend Integration**
- **API**: FastAPI (Python)
- **Authentication**: JWT token-based authentication
- **Database**: PostgreSQL (via FastAPI backend)

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- FastAPI backend running (separate repository)


3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Backend Setup**
This frontend requires a FastAPI backend. Make sure your backend is running on `http://localhost:8000`.

## 🌐 API Integration

The application integrates with a FastAPI backend through RESTful APIs:

### **Authentication**
- Admin login with JWT tokens
- Protected routes with token validation

### **Product Management**
- Fetch products with pagination and filtering
- CRUD operations for admin users
- Category hierarchy management

### **Order Processing**
- Cart management with Redux
- Checkout flow with customer information
- Order creation and tracking


## 🔐 Authentication

### **Admin Access**
- Login at `/admin/login`
- Default credentials (configure in your backend):
  - Username: `admin`
  - Password: `admin123`

### **Protected Routes**
All admin routes are protected and require valid JWT tokens.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Adapted layouts and navigation
- **Mobile**: Touch-friendly interface with mobile-first design
