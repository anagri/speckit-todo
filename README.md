# Todo List Application

A modern, client-side todo list application built with Next.js, React 18, TypeScript, and Tailwind CSS.

## Features

- ✅ Create, read, update, and delete todos
- 🏷️ Tag and categorize todos
- 🎯 Priority levels (low, medium, high)
- 📅 Schedule todos with date and time
- 🔍 Filter by status, priority, tags, and categories
- 📊 Sort by priority, scheduled date, or creation date
- 💾 Automatic localStorage persistence
- 🗑️ Soft delete with restore capability
- 📱 Responsive design for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Storage**: Browser Local Storage
- **Testing**: Jest + React Testing Library
- **Deployment**: GitHub Pages (static export)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build locally
npx serve out
```

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Push to main branch**: The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
   - Run all tests
   - Run linter
   - Build the static export
   - Deploy to GitHub Pages

3. **Access your site** at `https://<username>.github.io/<repository>/`

### Manual Deployment

```bash
# Build static export
npm run build

# Deploy the `out` directory to your hosting provider
# The build output is in the `out` directory
```

## Project Structure

```
├── components/        # React components
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   ├── TodoFilters.tsx
│   └── ui/           # shadcn/ui components
├── lib/              # Business logic and utilities
│   ├── types.ts      # TypeScript type definitions
│   ├── storage.ts    # Local Storage API
│   ├── TodoContext.tsx   # React Context provider
│   ├── todoReducer.ts    # State management reducer
│   ├── filters.ts    # Filter functions
│   ├── sorts.ts      # Sort functions
│   └── selectors.ts  # Derived state selectors
├── pages/            # Next.js pages
│   ├── _app.tsx      # App wrapper with providers
│   └── index.tsx     # Main todo page
├── __tests__/        # Test files
│   ├── lib/
│   └── components/
└── styles/           # Global styles
    └── globals.css
```

## Architecture

### State Management

- **Global State**: React Context + useReducer pattern
- **Persistence**: Automatic sync to localStorage on every state change
- **Data Flow**: Unidirectional (Actions → Reducer → State → Components)

### Storage

- **Primary**: Browser Local Storage
- **Schema Version**: v1.0.0 (supports future migrations)
- **Error Handling**: QuotaExceededError displayed to user
- **Validation**: Runtime validation on load

### Filtering & Sorting

- **Filters**: Status, Priority, Tags, Categories, Date Range
- **AND Logic**: Multiple filter types combined
- **OR Logic**: Within same filter type (e.g., multiple tags)
- **Single Sort**: One criterion at a time (priority, date, created)
- **Sort Direction**: Ascending or descending toggle

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires localStorage support (enabled by default in all modern browsers).

## License

MIT

## Contributing

This is a demonstration project built following strict TDD principles and constitutional requirements. See `specs/001-we-will-be/` for full specifications.
