# 🛍 Mini Store — Frontend Challenge

A modern Vue 3 e-commerce application built with Vue Router, Pinia, and Vite. Features a clean, responsive design with product browsing, search, filtering, and cart management.

## ✨ Features

- **Product Browsing**: Grid view of products with images, titles, prices, and ratings
- **Search & Filtering**: Real-time search with debouncing and category filtering
- **Product Details**: Detailed product pages with image gallery, descriptions, and add to cart
- **Shopping Cart**: Persistent cart with quantity management and order summary
- **Responsive Design**: Mobile-first design that works on all devices
- **URL State Management**: Search and filter state preserved in URL
- **Accessibility**: Keyboard navigation and ARIA labels throughout

## 🛠 Tech Stack

- **Vue 3** (Composition API) with **TypeScript**
- **Vue Router 4** for navigation
- **Pinia** for state management
- **Vite** for build tooling
- **Vanilla CSS** for styling (no external UI libraries)
- **Cypress** for E2E testing
- **ESLint** with TypeScript support
- **Prettier** for code formatting

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mini-store
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing

### E2E Tests

Run Cypress E2E tests:

```bash
# Open Cypress UI
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

### All Tests

Run all tests:

```bash
npm run test:e2e
```

## 🔧 Development Tools

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## 🏗 Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Header.vue      # Navigation header with cart badge
│   └── ProductCard.vue # Product card component
├── pages/              # Page components
│   ├── Home.vue        # Product listing with search/filter
│   ├── ProductDetails.vue # Individual product page
│   └── Cart.vue        # Shopping cart page
├── stores/             # Pinia stores
│   └── cart.ts         # Cart state management
├── services/           # API services
│   └── api.ts          # API client for Fake Platzi Store
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.vue             # Root component
├── main.ts             # Application entry point
└── shims-vue.d.ts      # Vue type declarations
```

## 🔌 API Integration

The application integrates with the [Fake Platzi Store API](https://fakeapi.platzi.com/):

- `GET /products` - List all products
- `GET /products/{id}` - Get product details
- `GET /categories` - List all categories

All API calls are handled through the `services/api.js` module with proper error handling.

## 🛒 Cart Functionality

- **Persistent Storage**: Cart data is saved to `localStorage` with key `cart:v1`
- **Quantity Management**: Add, remove, and update item quantities
- **Real-time Updates**: Cart badge updates automatically
- **Order Summary**: Calculates totals, discounts, and shipping

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with smooth animations
- **Responsive Grid**: Adapts from 1 column (mobile) to 3 columns (desktop)
- **Loading States**: Spinner animations and skeleton screens
- **Error Handling**: User-friendly error messages with retry options
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🧪 Test Coverage

### E2E Tests

- Complete shopping flow
- Search and filtering
- URL state persistence
- Error handling
- Cart persistence across page reloads

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service

## 📝 License

This project is created for the Raidiam Frontend Challenge.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

Built with ❤️ using Vue 3 and modern web technologies.
