# Data Update Portal

A modern Enterprise SaaS Data Management Platform built with Next.js, providing a comprehensive interface for managing data updates, job submissions, approvals, and templates.

## Features

- **Dashboard** - Real-time overview of active jobs, pending approvals, and statistics
- **File Upload** - Bulk data upload with template validation
- **Job Management** - Track and monitor data update jobs
- **Approval Workflow** - Review and approve submitted changes
- **Template Library** - Pre-configured templates for different data types
- **Item Management** - Manage data items and configurations
- **Dark/Light Theme** - User preference-based theme with localStorage persistence
- **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Component Library**: [Ant Design 5](https://ant.design/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Ant Design Icons](https://ant.design/components/icon)
- **State Management**: React Context API
- **Routing**: Next.js App Router

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 (LTS recommended)
- **npm** >= 9.0.0 or **yarn** >= 1.22.0 or **pnpm** >= 8.0.0
- **Git** (for version control)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables** (if needed)
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server on `http://localhost:3000` |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server (requires `npm run build` first) |
| `npm run lint` | Runs ESLint to check code quality |

## Environment Variables

Currently, this project doesn't require environment variables for basic functionality. If you need to configure external APIs or services, create a `.env.local` file:

```bash
# Example environment variables
# NEXT_PUBLIC_API_URL=https://api.example.com
# NEXT_PUBLIC_APP_ENV=development
```

**Note**: Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Folder Structure

```
client-app/
├── app/                          # Next.js App Router directory
│   ├── approvals/               # Approvals page
│   ├── components/              # Shared React components
│   │   ├── AppLayout.tsx        # Main application layout (sidebar, header)
│   │   └── ThemeToggle.tsx      # Dark/light theme toggle button
│   ├── context/                 # React Context providers
│   │   └── ThemeContext.tsx     # Theme state management
│   ├── help/                    # Help/documentation page
│   ├── items/                   # Items management page
│   ├── jobs/                    # Jobs listing page
│   ├── settings/                # Settings page
│   ├── templates/               # Templates library page
│   ├── upload/                  # File upload page
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout (metadata, providers)
│   └── page.tsx                 # Dashboard home page
├── public/                      # Static assets
├── node_modules/                # Dependencies (gitignored)
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

### Key Directories Explained

- **`app/`** - Contains all routes and pages using Next.js App Router
- **`app/components/`** - Reusable React components used across pages
- **`app/context/`** - Global state management using React Context
- **`public/`** - Static files served at the root URL

## Development

### Creating a New Page

1. Create a new folder in `app/` with the route name
2. Add a `page.tsx` file inside:
   ```tsx
   'use client';

   import AppLayout from '@/components/AppLayout';

   export default function MyNewPage() {
     return (
       <AppLayout>
         <h1>My New Page</h1>
       </AppLayout>
     );
   }
   ```

### Adding to Navigation

Update `app/components/AppLayout.tsx`:
1. Add route mapping in `routeToKeyMap` and `keyToRouteMap`
2. Add menu item to `menuItems` array
3. Add page title to `getPageTitle` function

### Theme Customization

- **Global CSS variables**: Edit `app/globals.css`
- **Ant Design theme**: Modify `app/context/ThemeContext.tsx`
- **Component styles**: Use Ant Design's inline styles or Tailwind classes

## Building for Production

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Test production build locally**
   ```bash
   npm run start
   ```

3. **Optimize for performance**
   - Next.js automatically optimizes images with `next/image`
   - Code splitting is handled automatically
   - CSS is minified and optimized

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production deployment**
   ```bash
   vercel --prod
   ```

**Or deploy via GitHub integration:**
1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Vercel will automatically deploy on every push

### Other Platforms

#### Netlify
```bash
npm run build
# Deploy the `out` directory (if using static export)
# Or use Netlify's Next.js integration
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### AWS, Azure, Google Cloud
- Build the project: `npm run build`
- Deploy the `.next` folder and `node_modules`
- Run `npm start` on the server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Server Components** - Uses React Server Components for improved performance
- **Code Splitting** - Automatic route-based code splitting
- **Lazy Loading** - Dynamic imports for heavy components
- **Image Optimization** - Next.js Image component with automatic optimization
- **Font Optimization** - Automatic font loading optimization

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
