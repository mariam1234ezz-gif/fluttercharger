# EV Charging Station Admin Dashboard

A professional, high-fidelity mobile admin dashboard UI for a **Smart Hybrid Solar-Grid EV Battery Charging and Swapping Station** with real-time IoT monitoring.

## 🚀 Overview

This is a comprehensive React + TypeScript application designed for station owners and administrators to monitor, control, and manage a hybrid EV battery charging station in real-time. The dashboard provides professional-grade monitoring, energy management, safety controls, and operational analytics.

## ✨ Features

### 1. **Dashboard Home**
- Total charging slots overview
- Available, occupied, and faulty slot counts
- Charged and empty battery inventory
- Active charging sessions tracking
- Total energy consumed with solar/grid breakdown
- Daily revenue and system efficiency metrics
- Real-time energy mix visualization (pie charts)
- Energy input trends over time

### 2. **Real-Time Monitoring**
- Live voltage, current, power, and temperature display
- State of Charge (SOC) progress indicators
- Active charging session cards with metrics
- Voltage, temperature, and power trend charts
- Individual slot controls (resume/stop)
- Temperature monitoring with status indicators

### 3. **Energy Source Monitoring**
- Solar generation tracking
- Grid power input monitoring
- Energy flow visualization
- Solar panel array and grid connection status
- Efficiency metrics
- Cost savings calculation
- Composed charts showing energy input, output, and efficiency

### 4. **Safety & Alerts**
- Critical alert management
- Alert severity levels (Critical, Warning, Info)
- System health status monitoring
- Emergency stop button
- Alert history and resolution tracking
- Recommended actions for each alert type
- Real-time alert acknowledgment

### 5. **Charging Slot Management**
- Grid and list view options
- Slot status visualization
- Real-time metrics for each slot
- Remote start/stop controls
- Fast/Normal charging mode selection
- Individual slot detail panels
- Quick slot status cards

### 6. **Battery Swapping Management**
- Charged and ready batteries inventory
- Empty batteries in charging queue
- Faulty batteries awaiting maintenance
- Swapping operations log
- Battery health monitoring
- Capacity and SOC tracking
- Battery deployment controls

### 7. **Reports & Analytics**
- Daily, weekly, and monthly reports
- Charging session analytics
- Energy consumption trends
- Revenue tracking
- Solar contribution analysis
- Detailed performance statistics
- Carbon offset calculations
- Daily report tables with detailed metrics

## 🎨 Design Features

- **Dark Mode**: Professional dark theme optimized for 24/7 monitoring
- **Modern UI**: Clean, futuristic design with glassmorphic cards
- **Responsive Design**: Fully responsive from mobile to desktop
- **Color Coding**: 
  - 🟢 Green: Available/Success status
  - 🔵 Blue: Active/Info status
  - 🟡 Yellow: Warning status
  - 🔴 Red: Critical/Faulty status
- **Status Indicators**: Real-time status badges and color-coded alerts
- **Icons**: Lucide React icons throughout for clarity
- **Charts**: Recharts for professional data visualization
- **Animations**: Smooth transitions and loading states

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: System UI fonts optimized for readability

## 📋 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Dashboard home
│   ├── monitoring/page.tsx      # Real-time monitoring
│   ├── energy/page.tsx          # Energy monitoring
│   ├── alerts/page.tsx          # Safety & alerts
│   ├── slots/page.tsx           # Slot management
│   ├── batteries/page.tsx       # Battery swapping
│   ├── reports/page.tsx         # Analytics & reports
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Navigation.tsx           # Sidebar navigation
│   ├── Header.tsx               # Top header bar
│   ├── Cards.tsx                # Reusable card components
│   └── Widgets.tsx              # Data widgets
├── lib/
│   ├── mockData.ts              # Mock data for development
│   └── utils.ts                 # Utility functions
└── types/
    └── index.ts                 # TypeScript interfaces
```

## 📊 Data & Mock API

The dashboard uses comprehensive mock data including:
- **8 Charging Slots** with real-time status and metrics
- **6 Battery Packs** with health and capacity tracking
- **Multiple Alerts** with severity levels
- **Energy Data** with hourly solar/grid breakdown
- **Charging Sessions** with detailed metrics
- **7-day Report Data** for analytics

## 🎯 Key Screens

1. **Dashboard** - Overview with key metrics and charts
2. **Monitoring** - Real-time data for active sessions
3. **Energy** - Solar and grid power analysis
4. **Alerts** - Safety management and emergency controls
5. **Slots** - Charging unit management
6. **Batteries** - Inventory and swapping operations
7. **Reports** - Performance analytics and insights

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open in Browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## 📱 Responsive Design

- **Mobile**: Full functionality on small screens with collapsible navigation
- **Tablet**: Optimized grid layouts for medium screens
- **Desktop**: Full dashboard experience with sidebar navigation

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize:
- Primary color: `#00d4ff` (cyan)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (yellow)
- Danger: `#ef4444` (red)

### Dark Mode
Dark mode is enabled by default. Toggle in `src/app/layout.tsx`

## 🔧 Configuration

- Environment variables in `.env.local`
- Tailwind configuration in `tailwind.config.ts`
- TypeScript configuration in `tsconfig.json`

## 📈 Features Highlights

✅ Real-time monitoring with live data updates
✅ Professional energy flow visualization
✅ Comprehensive alert management system
✅ Battery inventory tracking with health monitoring
✅ Remote charging control capabilities
✅ Historical data analytics and reporting
✅ Emergency stop functionality
✅ System efficiency monitoring
✅ Cost and carbon offset tracking
✅ Responsive mobile-first design

## 🎓 Use Cases

- Station owner real-time monitoring
- Admin control and maintenance
- Emergency response management
- Performance analytics and reporting
- Energy management optimization
- Battery inventory management
- Revenue tracking
- System health monitoring

## 📝 Notes

- Mock data is used for development and demonstration
- All UI is fully functional with local state management
- Ready for API integration
- Professional engineering-grade dashboard
- Suitable for production deployment

## 🔐 Security Considerations

- Implement proper authentication
- Add API request validation
- Use secure WebSocket for real-time data
- Implement role-based access control
- Add audit logging for critical operations

## 🚀 Future Enhancements

- WebSocket real-time data sync
- Backend API integration
- User authentication & authorization
- Advanced predictive analytics
- Mobile app version (React Native)
- IoT device integration
- Automated alerts and notifications
- Export reports (PDF, CSV)
- Multi-station management
- Custom dashboard layouts

## 📄 License

This project is designed as an IoT engineering graduation project. Customize and use as needed for your smart charging station system.

---

**Built with ⚡ for Smart Energy Management**
