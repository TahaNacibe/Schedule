# Next.js + Electron + Tailwind Starter

A modern, production-ready boilerplate for building cross-platform desktop apps with Next.js (App Router), TypeScript, Tailwind CSS, and Electron. Perfect for developers who want a fast, type-safe setup with hot-reloading in dev and seamless bundling for production.

[![npm version](https://badge.fury.io/js/next-electron-starter.svg)](https://badge.fury.io/js/next-electron-starter) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Next.js 14+** with App Router for server-side rendering and file-based routing.
- **TypeScript** for type safety out of the box.
- **Tailwind CSS** with custom sizing utilities (e.g., extended breakpoints and spacing scales).
- **Electron** for desktop app packaging (Windows, macOS, Linux).
- **ESLint & Prettier** for code quality.
- **Concurrent dev server**: Next.js and Electron run in parallel with auto-reload.
- **Production-ready**: Built with `next export` for static Electron bundling.
- **Minimal & Extensible**: No bloat—add your own state management (e.g., Zustand, Redux) or UI libs (e.g., shadcn/ui) easily.

## Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))

### Installation
1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/nextjs-electron-tailwind-template.git my-app
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run electron
   ```
   - This launches the Next.js dev server on `http://localhost:3000` and opens an Electron window.
   - Edit files in `src/app/` for hot-reloading.

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server only. |
| `npm run electron` | Start Electron + Next.js in dev mode (concurrent). |
| `npm run build` | Build Next.js for production (static export). |
| `npm run start` | Run the built Electron app. |
| `npm run lint` | Run ESLint. |

### Production Build
1. Build: `npm run build`
2. Run: `npm run start`
3. Package for distribution: Install `electron-builder` (`npm i -D electron-builder`), then add to `package.json`:
   ```json
   "scripts": {
     "dist": "electron-builder"
   }
   ```
   Run `npm run dist` for installers (.exe, .dmg, etc.).

## Project Structure
```
my-app/
├── electron/          # Electron config
│   ├── main.js        # Main process (window creation)
│   └── preload.js     # Preload script (API exposure)
├── src/               # Next.js source
│   ├── app/           # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css # Tailwind imports
│   └── components/    # Reusable UI components
├── public/            # Static assets
├── tailwind.config.ts # Custom Tailwind (sizing, themes)
├── package.json       # Dependencies & scripts
└── next.config.js     # Next.js config (for Electron)
```

## Customization

### Tailwind Sizing
The `tailwind.config.ts` includes extended spacing and sizing:
```ts
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem', // Custom 18-unit spacing
        // Add more as needed
      },
      screens: {
        'xs': '475px', // Extra small breakpoint
      },
    },
  },
};
```
Update and rebuild Tailwind: `npm run build` (or watch in dev).

### Adding Routes
- Create folders in `src/app/` (e.g., `src/app/dashboard/page.tsx` for `/dashboard`).
- Use Next.js docs: [App Router](https://nextjs.org/docs/app).

### Electron Tweaks
- Edit `electron/main.js` for window options (size, icons, menus).
- Expose Node APIs via `preload.js` for renderer security.

## Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License
MIT © [Taha Necib](https://github.com/TahaNacibe). See [LICENSE](LICENSE) for details.

---

*Built using Next.js, Electron, and Tailwind. Questions? Open an issue!*
