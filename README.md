# TechHive - E-commerce App

TechHive is a modern e-commerce mobile app built with Expo (React Native) that allows users to browse products, manage their cart, place orders, and more. The app is fully integrated with a backend API for authentication, product management, and order processing.

## Features

- **User Authentication**
  - Register a new account
  - Login with email and password
  - JWT-based authentication (token saved in secure storage)
  - Logout functionality
  - Persistent login across app restarts

- **Product Browsing**
  - View a list of all products fetched from the backend
  - View detailed product information, including images, description, price, and specifications
  - Product gallery with image zoom
  - Search and filter products (extendable)

- **Cart Management**
  - Add products to cart from product detail or list
  - View and update cart items and quantities
  - Remove items from cart
  - Cart state persists during session

- **Checkout & Orders**
  - Checkout flow with address and payment method (extendable)
  - Place orders and view order confirmation
  - Order history (extendable)

- **Reviews**
  - View customer reviews on product detail page
  - Add reviews for purchased products (extendable)

- **Navigation & UI**
  - Tab-based navigation (Home, Cart, etc.)
  - Custom header with logout button and cart icon
  - Responsive and modern UI with Tailwind-like styling

- **Backend Integration**
  - All data (products, cart, orders, auth) is fetched from and synced with a RESTful backend API
  - API endpoints for authentication, products, cart, orders, and reviews

## Tech Stack

- **Frontend:** React Native (Expo), TypeScript, Tailwind CSS (via NativeWind), Expo Router
- **Backend:** RESTful API (Django/DRF or similar, not included in this repo)
- **State Management:** React Context API for Auth and Cart
- **Storage:** AsyncStorage for JWT token persistence

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the app**
   ```bash
   npx expo start
   ```
3. **Configure Backend URL**
   - Update the `BASE_URL` in `lib/api.ts` to point to your backend server (use your local IP for device testing).

## Project Structure

- `app/` - Main app screens and navigation
- `components/` - Reusable UI components (Button, Input, ProductCard, etc.)
- `lib/api.ts` - API utility for backend communication
- `constants/` - App-wide constants (colors, etc.)
- `context/` - Auth and Cart context providers

## Backend API Endpoints

- **Authentication:** `/auth/register/`, `/auth/token/`, `/auth/logout/`
- **Products:** `/products/products/`, `/products/products/{id}/`
- **Cart:** `/cart/`, `/cart/add_items/`, `/cart/remove_items/`
- **Orders:** `/orders/`, `/orders/checkout/`
- **Reviews:** `/reviews/`, `/reviews/products/{product_id}/reviews/`

## Customization & Extending
- Add more screens (profile, order history, etc.)
- Extend cart and checkout logic as needed
- Add push notifications, analytics, etc.

## License
MIT
