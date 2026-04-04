# AERON PARFUM Website TODO

## Frontend - Completed
- [x] Basic homepage layout with hero section
- [x] Navigation menu
- [x] Product showcase section
- [x] About section
- [x] Call-to-action section
- [x] Footer with links
- [x] Quiet Luxury design system (colors, typography, spacing)
- [x] Responsive design

## Database & Backend - Completed
- [x] Create database schema (products, reviews, newsletter subscribers)
- [x] Create API endpoints for products (list, get, create, update, delete)
- [x] Create API endpoints for reviews (list, create, delete)
- [x] Create API endpoint for newsletter signup
- [x] Integrate newsletter signup form
- [ ] Integrate product listing from database
- [ ] Integrate review system on product pages

## Features to Add
- [ ] Product gallery page with database integration
- [ ] Customer reviews and ratings system
- [ ] Newsletter email subscription
- [ ] Admin panel for product management
- [ ] User authentication and profiles
- [ ] Shopping cart functionality
- [ ] Order management system

## Product Categories - Completed
- [x] Add category field to products table (Women's/Men's)
- [x] Create API endpoints for filtering products by category
- [x] Build products page with category tabs/filters
- [x] Display products organized by gender category
- [x] Add category selection in admin product creation


## Order Management System - Completed
- [x] Create orders and order_items database tables
- [x] Build tRPC procedures for order operations (create, list, get, update status)
- [x] Implement customer order history page (/orders)
- [x] Implement order tracking page (/track-order)
- [x] Build admin orders dashboard (/admin/orders)
- [x] Add order status tracking (pending, processing, shipped, delivered)
- [x] Integrate Sheety Google Sheets syncing for order tracking
- [ ] Integrate checkout with order creation (connect Cart to create order)


## Search & Product Details - Completed
- [x] Add search icon to navigation bar
- [x] Implement product search functionality
- [x] Create product detail page component
- [x] Add product routes and navigation
- [x] Test search and product detail pages
