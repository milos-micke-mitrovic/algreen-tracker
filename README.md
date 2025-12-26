# Algreen Tracker

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) package manager

### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/milos-micke-mitrovic/algreen-tracker.git
   cd algreen-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

## Running the App

### Development

```bash
pnpm dev
```

Opens at: http://localhost:3989

### Production Build

```bash
pnpm build
pnpm preview
```

## Other Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Check code for errors |
| `pnpm lint:fix` | Fix linting errors |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Check TypeScript types |

## Documentation

- [Git Workflow](./docs/GIT.md) - How to work with branches and pull requests
- [Project Structure](./docs/STRUCTURE.md) - Where to put your code
- [Styling Guide](./docs/STYLING.md) - How to style components
- [Components Guide](./docs/COMPONENTS.md) - How to use shadcn/ui components
- [Forms Guide](./docs/FORMS.md) - How to build forms with validation
- [Data Fetching](./docs/DATA-FETCHING.md) - How to fetch data from APIs
