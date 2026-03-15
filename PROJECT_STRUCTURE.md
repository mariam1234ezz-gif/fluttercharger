# Project Structure

## Complete File Tree

```
fluttercharger/
├── .github/
│   └── copilot-instructions.md      # Project setup and status documentation
├── src/
│   ├── app/
│   │   ├── alerts/
│   │   │   └── page.tsx              # Safety & Alerts screen
│   │   ├── batteries/
│   │   │   └── page.tsx              # Battery Swapping Management
│   │   ├── energy/
│   │   │   └── page.tsx              # Energy Source Monitoring
│   │   ├── monitoring/
│   │   │   └── page.tsx              # Real-Time Monitoring
│   │   ├── reports/
│   │   │   └── page.tsx              # Reports & Analytics
│   │   ├── slots/
│   │   │   └── page.tsx              # Charging Slot Management
│   │   ├── globals.css               # Global styles and animations
│   │   ├── layout.tsx                # Root layout with metadata
│   │   └── page.tsx                  # Dashboard Home screen
│   ├── components/
│   │   ├── Cards.tsx                 # Reusable card components
│   │   ├── Header.tsx                # Top navigation header
│   │   ├── Navigation.tsx            # Sidebar navigation
│   │   └── Widgets.tsx               # Data widgets and gauges
│   ├── lib/
│   │   ├── mockData.ts               # Mock data for testing
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── .env.local                        # Environment variables
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Main project documentation
└── QUICK_START.md                    # Quick start guide
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies, scripts, and metadata |
| `tsconfig.json` | TypeScript compiler configuration |
| `next.config.ts` | Next.js specific configuration |
| `tailwind.config.ts` | Tailwind CSS theme and extensions |
| `postcss.config.mjs` | PostCSS plugins (Tailwind, Autoprefixer) |
| `.eslintrc.json` | ESLint rules for code quality |
| `.env.local` | Local environment variables |
| `.gitignore` | Files to ignore in version control |

### App Structure

#### Pages (Screens)

1. **`src/app/page.tsx`** - Dashboard Home
   - Overview with key statistics
   - Energy mix pie chart
   - Energy timeline bar chart
   - Slot status summary
   - Active alerts
   - Battery inventory
   - System efficiency gauge

2. **`src/app/monitoring/page.tsx`** - Real-Time Monitoring
   - Live system metrics
   - Voltage trend chart
   - Power distribution area chart
   - Temperature monitoring
   - Active charging sessions with controls
   - Individual slot metrics

3. **`src/app/energy/page.tsx`** - Energy Source Monitoring
   - Solar vs grid statistics
   - Energy source breakdown
   - Solar and grid performance gauges
   - Energy input timeline
   - Energy output area chart
   - Solar array and grid status tables

4. **`src/app/alerts/page.tsx`** - Safety & Alerts
   - Emergency stop button
   - Alert summary statistics
   - System health status
   - Active alerts list
   - Resolved alerts history
   - Alert detail panel with recommendations

5. **`src/app/slots/page.tsx`** - Charging Slot Management
   - Slot statistics (available/charging/faulty)
   - Grid and list view modes
   - Slot status cards with metrics
   - Individual slot detail panel
   - Remote control buttons (start/stop)
   - SOC and temperature indicators

6. **`src/app/batteries/page.tsx`** - Battery Swapping Management
   - Battery inventory overview
   - Charged batteries ready section
   - Empty batteries charging queue
   - Faulty batteries maintenance section
   - Swapping operations log
   - Battery detail panel

7. **`src/app/reports/page.tsx`** - Reports & Analytics
   - Period selector (daily/weekly/monthly)
   - Key performance metrics
   - Charging sessions bar chart
   - Energy consumption line chart
   - Daily revenue bar chart
   - Energy source distribution
   - Daily statistics and energy analysis
   - Detailed daily report table

#### Components

| Component | Purpose |
|-----------|---------|
| `Navigation.tsx` | Responsive sidebar navigation with mobile toggle |
| `Header.tsx` | Top header with title, time, and quick actions |
| `Cards.tsx` | StatCard, Card, Badge, Button, ProgressBar components |
| `Widgets.tsx` | DataWidget, MetricRow, GaugeChart, ValueTable components |

#### Libraries

| File | Purpose |
|------|---------|
| `mockData.ts` | Comprehensive mock data for all features |
| `utils.ts` | Formatting, conversion, and status utility functions |

#### Types

| File | Purpose |
|------|---------|
| `types/index.ts` | TypeScript interfaces for all data types |

### Styling

| File | Purpose |
|------|---------|
| `globals.css` | Global styles, animations, utilities |
| `tailwind.config.ts` | Custom colors, gradients, and theme |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `QUICK_START.md` | Quick start and setup guide |
| `.github/copilot-instructions.md` | Setup status and instructions |

## Key Features by File

### Data Management
- **mockData.ts**: 8 charging slots, 6 batteries, multiple alerts, energy data, charging sessions, reports

### Component Library
- **Cards.tsx**: 6 reusable components with variants
- **Widgets.tsx**: 4 specialized data display widgets
- **Navigation.tsx**: Responsive mobile-aware navigation
- **Header.tsx**: Live clock and notification badge

### Styling
- Dark theme with cyan primary color
- Gradient backgrounds for energy types
- Status-based color coding
- Smooth animations and transitions

## Dependencies

### Core
- next@^14.0.0 - React framework
- react@^18.2.0 - UI library
- react-dom@^18.2.0 - DOM rendering

### Styling
- tailwindcss@^3.3.0 - Utility CSS
- postcss@^8.4.31 - CSS processor
- autoprefixer@^10.4.16 - Browser prefixing

### Data Visualization
- recharts@^2.10.0 - React charts

### UI
- lucide-react@^0.292.0 - Icon library
- class-variance-authority@^0.7.0 - CSS class utilities
- clsx@^2.0.0 - Class name utility
- tailwind-merge@^2.2.0 - Merge Tailwind classes

### Development
- typescript@^5.3.0 - TypeScript compiler
- eslint@^8.54.0 - Code linting

## Scripts

```json
{
  "dev": "next dev",           // Start dev server on port 3000
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "next lint",         // Run ESLint
  "type-check": "tsc --noEmit" // Check TypeScript
}
```

## Environment Setup

### .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### tsconfig.json Path Alias
```
"@/*": ["./src/*"]
```

This allows importing from `@/components`, `@/lib`, etc.

## Total Files: 28+

- Configuration files: 8
- Page files: 7
- Component files: 4
- Library files: 2
- Type files: 1
- Style files: 2
- Documentation files: 3

---

**Everything is organized for scalability and maintainability!**
