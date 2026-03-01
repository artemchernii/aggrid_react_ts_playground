# AG Grid React TypeScript Playground

This project is a small playground built with **React**, **TypeScript**, and **AG Grid** (v33) using **Vite**.

It demonstrates:
- AG Grid module registration for row model, row drag, and filter modules
- Legacy CSS theming (`ag-theme-alpine`) with `theme="legacy"`
- Drag and drop row reordering from the `make` column (`rowDrag: true`)
- A sample dataset with multiple car rows
- Basic sorting and filtering on columns

## Tech Stack

- React 18
- TypeScript
- Vite
- ag-grid-community
- ag-grid-react

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal.

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally

## Notes

- The project currently uses AG Grid legacy CSS theming.
- If you migrate to the new AG Grid Theming API, remove CSS theme imports and update the grid `theme` configuration accordingly.
