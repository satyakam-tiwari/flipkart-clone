# Flipkart Clone

This is a **Flipkart-style e-commerce website clone** built using **HTML, CSS, and JavaScript**.  
The project replicates the look and feel of Flipkart, including the **navbar, sidebar, product grid, cart panel, checkout flow, and order history**.  

All product images are fetched from **online links**, so no local uploads are required.  

## 🌐 Live Website
Visit Website https://satyakam-tiwari.github.io/flipkart-clone/

## Features

### Home Page
- Responsive **navbar** with Flipkart colors (`#2874f0` blue header and `#ffcc00` yellow buttons).  
- **Search bar** (non-functional placeholder).  
- **Sidebar categories**: All, Mobiles, Laptops, Headphones.  
- **Product grid** with hover effects and “Add to Cart” button.  
- **Cart panel** slides in from the right with **live item count**.  

### Cart
- Increment / decrement item quantity.  
- Remove items from cart.  
- Total price calculation.  
- “Proceed to Checkout” button navigates to checkout page.  

### Checkout Page
- Billing details form (Name, Phone, Address).  
- Payment options: COD, Card, UPI.  
- Dynamic payment input fields based on selection.  
- Order summary with all cart items and total price.  
- Place order stores data in **localStorage**.  

### Orders Page
- Shows all previous orders in **Flipkart-style order cards**.  
- Order cards include:  
  - Order ID & Date  
  - Customer Name & Address  
  - Payment Method  
  - Items with quantity and subtotal  
  - Total price  
- “Shop Now” button if no orders exist.  

### Technical Features
- Fully **responsive design** for mobile and desktop.  
- Uses **localStorage** for cart and orders — no backend required.  
- Products use **online image links**, no local image files needed.  
- All JS functions are **modular**, handling products, cart, checkout, and orders.  

---

## Project Structure

