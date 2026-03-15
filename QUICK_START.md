# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Node.js
If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)
- Required: Node.js 18 or higher
- Includes npm (Node Package Manager)

### Step 2: Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```
This installs all required packages (React, Next.js, Tailwind, Recharts, etc.)

### Step 3: Start Development Server
```bash
npm run dev
```
You should see output like:
```
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Open in Browser
Click the link or navigate to: **http://localhost:3000**

## 🎮 Navigating the Dashboard

### Sidebar Navigation (Left Side)
- **Dashboard** - Main overview page
- **Monitoring** - Real-time metrics
- **Energy** - Solar/grid monitoring
- **Alerts** - Safety & emergency controls
- **Slots** - Charging unit management
- **Batteries** - Battery inventory
- **Reports** - Analytics & reports

### Mobile Navigation
On mobile, click the **☰ Menu** button in the top-left to open the navigation sidebar.

## 📊 Key Features to Explore

### Dashboard Home
- View overall station status
- See charging session counts
- Check battery inventory
- View energy consumption
- Monitor daily revenue
- See system efficiency

### Real-Time Monitoring
- Live voltage, current, power readings
- Temperature monitoring
- Charging progress for each slot
- Trend charts for all metrics

### Energy Monitoring
- Solar generation vs grid power
- Energy efficiency percentage
- Cost savings calculations
- Historical energy trends

### Safety & Alerts
- Emergency stop button
- Active alerts list
- System health status
- Alert history

### Slot Management
- View all charging slots
- See status (available/charging/faulty)
- Control individual slots
- Switch between grid and list views

### Battery Management
- Charged batteries ready for deployment
- Empty batteries in queue
- Faulty batteries needing service
- Battery swapping operations log

### Reports
- Daily/weekly/monthly analytics
- Revenue tracking
- Energy consumption trends
- Detailed statistics

## 🎨 Customizing the Dashboard

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'primary': '#00d4ff',        // Change cyan to your color
  'success': '#10b981',         // Change green
  'warning': '#f59e0b',         // Change yellow
  'danger': '#ef4444',          // Change red
}
```

### Modify Dashboard Data
Edit `src/lib/mockData.ts` to update:
- Charging slots status
- Battery inventory
- Alert messages
- Energy data

### Add Real API Data
Replace mock data imports with API calls:
```typescript
// Before:
const slots = mockChargerSlots;

// After:
const slots = await fetch('/api/slots').then(r => r.json());
```

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for linting errors
npm run lint

# Type check
npm run type-check
```

## 📱 Responsive Design

The dashboard works on all devices:
- **Mobile** (375px+): Sidebar collapses, full functionality
- **Tablet** (768px+): Optimized layouts
- **Desktop** (1024px+): Full sidebar and grid layouts

## 🎯 What You Can Do

✅ Monitor real-time charging data
✅ Control charging slots remotely
✅ Track battery inventory
✅ Manage safety alerts
✅ View energy analytics
✅ Generate reports
✅ Track revenue
✅ Monitor system health

## ⚠️ Important Notes

- **Mock Data**: The dashboard uses fake data for demonstration. Integration with real data requires API implementation.
- **Real-time Updates**: Currently uses static data. For real-time monitoring, integrate WebSocket or polling.
- **Authentication**: No login system implemented. Add authentication for production use.
- **Data Storage**: No backend database. Implement backend for data persistence.

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Dependencies Won't Install
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for TypeScript errors
npm run type-check

# See all errors
npm run lint
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

## 💡 Tips

1. **Use Browser DevTools** - F12 to inspect elements and debug
2. **Hot Reload** - Changes save automatically during development
3. **Mobile Preview** - Press Ctrl+Shift+K in browser to toggle phone view
4. **Console Log** - Add `console.log()` to debug data
5. **Inspect Network** - Use Network tab to see API calls (when integrated)

## 🚀 Next Steps

1. ✅ Explore all screens and features
2. ✅ Customize colors and branding
3. ✅ Update mock data to your station's specs
4. ✅ Plan API integration endpoints
5. ✅ Add user authentication
6. ✅ Connect to real IoT devices
7. ✅ Deploy to production server

---

**Happy monitoring! 🎉**
