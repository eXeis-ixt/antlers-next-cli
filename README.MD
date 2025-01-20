# Create Antlers App

A CLI tool to create modern Next.js applications with best practices and popular libraries pre-configured.

![Antlers CLI](https://raw.githubusercontent.com/eXeis-ixt/antlers-cli/main/banner.png)

## Features

- 🚀 Next.js 14+ with App Router
- 🎨 Shadcn/ui Components Pre-configured
- 🎯 TypeScript Support
- 🎭 TailwindCSS for Styling
- 📦 Optional Integrations:
  - 🔐 Authentication (NextAuth.js)
  - 💾 Database ORM (Prisma)
  - 🎨 Styling (TailwindCSS + PostCSS)
  - 🔄 State Management (@tanstack/react-query)

## Quick Start

```bash
# Create a new project
npx create-antlers-app my-app

# Navigate to your project
cd my-app

# Start the development server
npm run dev
```

## Pre-installed Shadcn/ui Components

The following components are pre-installed and ready to use:
- Button
- Dialog
- Input
- Label
- Select
- Toast (with useToast hook and Toaster)

## Usage

When you run `create-antlers-app`, you'll be prompted to:

1. Enter your project name
2. Choose which optional features to include:
   - Authentication with NextAuth.js
   - Database ORM with Prisma
   - Styling solutions
   - State management with TanStack Query

## Requirements

- Node.js 18.0.0 or later
- npm 7.0.0 or later

## What's Included?

The generated project will have:

- Next.js 14+ with App Router
- TypeScript configuration
- ESLint configuration
- TailwindCSS setup
- Shadcn/ui components
- Selected optional features
- Import aliases (@/*)
- Git initialized

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT © [Antlers Labs](https://github.com/eXeis-ixt)