<div align="center">
  <img src="./images/banner.jpg" alt="MOC Studio Banner" width="100%">
</div>

<br>

<div align="center">

🌐 **[Live Demo](https://mocstudio.lovable.app/)**

</div>

## 🚀 Overview

MOC Studio is an enterprise-grade full-stack web application leveraging cutting-edge technologies for building modern, responsive user interfaces with seamless backend integration through Supabase. Designed for developers who demand type safety, exceptional performance, and world-class developer experience.

## ✨ Key Features

- **Modern UI Components**: Built with Radix UI primitives and Shadcn UI for accessible, customizable, and production-ready components
- **Type Safety**: Full TypeScript implementation ensuring robust development and preventing runtime errors
- **Backend Integration**: Supabase integration for authentication, real-time data, and comprehensive data management
- **Form Management**: React Hook Form with Zod validation for bulletproof form handling and validation
- **Data Visualization**: Recharts integration for creating interactive, responsive charts and graphs
- **Responsive Design**: Tailwind CSS with custom theming, animations, and dark mode support
- **State Management**: TanStack React Query for efficient server state management and caching
- **Testing**: Vitest and React Testing Library for comprehensive test coverage and confidence
- **Developer Experience**: Hot module replacement, fast builds, and optimized tooling for rapid development

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with concurrent features
- **TypeScript 5.8** - Type safety and enhanced IDE support
- **Vite 5.4** - Lightning-fast build tool and dev server
- **React Router 6.30** - Declarative client-side routing
- **Tailwind CSS 3.4** - Utility-first styling framework

### UI Components
- **Shadcn UI** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Crisp, customizable icon library
- **next-themes** - Seamless dark mode support

### Backend & Data
- **Supabase 2.95** - Open-source Backend as a Service
- **TanStack Query 5.83** - Powerful data fetching and caching

### Forms & Validation
- **React Hook Form 7.61** - Performant form state management
- **Zod 3.25** - TypeScript-first schema validation

### Developer Tools
- **ESLint 9** - Code quality and consistency
- **Vitest 3.2** - Blazing-fast unit testing
- **Testing Library** - User-centric component testing

## 📋 Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, or **bun** package manager
- **Supabase** account and project

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/celloweb-ai/mocstudio.git
cd mocstudio
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚦 Usage

### Development Server
```bash
npm run dev
```
Application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Build for Development Environment
```bash
npm run build:dev
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
mocstudio/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Third-party integrations
│   ├── lib/            # Utility functions and helpers
│   ├── pages/          # Application pages/routes
│   ├── test/           # Test utilities and setup
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── supabase/           # Supabase configuration
└── package.json        # Project dependencies
```

## 🎨 UI Components

The project includes a comprehensive set of production-ready UI components:
- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu, Form
- Navigation Menu, Popover, Progress
- Radio Group, Select, Slider
- Switch, Tabs, Toast
- Tooltip, Toggle, and more

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `dev` | Start development server with HMR |
| `build` | Build optimized production bundle |
| `build:dev` | Build for development environment |
| `preview` | Preview production build locally |
| `lint` | Run ESLint checks |
| `test` | Run tests once |
| `test:watch` | Run tests in watch mode |

## 📄 License

This project is private and proprietary. All rights reserved.

## 👤 Author

**Celloweb AI**
- GitHub: [@celloweb-ai](https://github.com/celloweb-ai)

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the exceptional component system
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Supabase](https://supabase.com/) for powerful backend infrastructure
- [Vite](https://vitejs.dev/) for blazing fast development experience

---

<div align="center">
  <strong>Built with ❤️ by Celloweb AI</strong>
</div>