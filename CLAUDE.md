# Build/Lint/Test Commands
- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

# Code Style Guidelines
- **Framework**: Next.js with TypeScript and React Server Components
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Components**: React functional components with TypeScript interfaces
- **Imports**: Use aliases from tsconfig.json (e.g., `@/components`)
- **Types**: Strong typing with explicit TypeScript interfaces/types
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Component Pattern**: Use React.forwardRef for components with refs
- **Class Names**: Use `cn()` utility for conditional class merging
- **Error Handling**: Use try/catch blocks with meaningful error messages
- **File Structure**: Group by feature in dashboard routes