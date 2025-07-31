# DotCode Apps - Modern SPA

A modern Single Page Application (SPA) built with Next.js and React, featuring two main sections with lazy loading, responsive design, and interactive functionality.

## 🚀 Features

### General Requirements Fulfilled

- **Modern UI/UX**: Clean, responsive, and user-friendly design with Tailwind CSS
- **Modular & Scalable Code**: Reusable components and maintainable code structure
- **Lazy Loading**: Each section loads only when accessed via React.Suspense
- **Single Page Application**: Two sections with client-side navigation using Next.js

### Sections

1. **Interactive Workspace** (`/`)

   - Draggable and resizable blocks
   - Grid snapping functionality
   - Z-index management
   - Local storage persistence
   - Delete functionality

2. **Bitcoin Transactions** (`/`)
   - Real-time Bitcoin transaction tracker using Blockchain WebSocket API
   - Live transaction monitoring with Start/Stop/Reset controls
   - Total sum calculation of all transactions
   - Real-time transaction table with From/To addresses and amounts
   - WebSocket connection status and transaction count
   - Real implementation using Blockchain WebSocket API

## 🛠️ External Libraries Used

### Core Dependencies

- **Next.js 15.4.5**: React framework for production

  - _Justification_: Provides server-side rendering, routing, and build optimization

- **React 19.1.0**: UI library

  - _Justification_: Core framework for building user interfaces

### UI & Interaction Libraries

- **React RND 10.5.2**: Draggable and resizable components

  - _Justification_: Provides the core functionality for interactive workspace blocks

- **Tailwind CSS 4.x**: Utility-first CSS framework
  - _Justification_: Rapid UI development with responsive design and modern styling

### Development Dependencies

- **TypeScript 5.x**: Type safety

  - _Justification_: Ensures code quality and developer experience

- **ESLint**: Code linting
  - _Justification_: Maintains code quality and consistency

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page with navigation
│   │   └── globals.css        # Global styles
│   ├── components/             # Reusable components
│   │   ├── DraggableBlock.tsx # Draggable block component
│   │   └── ResizableBlock.tsx # Resizable block component
│   ├── pages/                  # Section components
│   │   ├── InteractiveWorkspace.tsx # Interactive workspace
│   │   └── BitcoinTransactions.tsx # Bitcoin transactions tracker
│   └── types/                  # TypeScript definitions
│       └── block.ts           # Block interfaces
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## 🔧 Architecture Highlights

### Client-Side Navigation

The application uses Next.js with client-side state management for navigation:

```typescript
const [currentPage, setCurrentPage] = useState<"workspace" | "bitcoin">(
  "workspace"
);
```

### Lazy Loading Implementation

Each section is loaded conditionally with Suspense:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  {currentPage === "workspace" ? (
    <InteractiveWorkspace />
  ) : (
    <BitcoinTransactions />
  )}
</Suspense>
```

### Component Architecture

- **Main Page**: Handles navigation and overall structure
- **Section Components**: Individual page components with specific functionality
- **Reusable Components**: Shared UI components for consistency

### State Management

- Local state with React hooks
- LocalStorage for persistence
- Component-level state management

## 🎨 Design System

### Color Palette

- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale

### Typography

- Geist Sans: Primary font
- Geist Mono: Monospace font

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🪙 Bitcoin Transactions Feature

### Functional Requirements Implemented

1. **Display Live Transactions**

   - Continuously updating list of incoming Bitcoin transactions
   - Real-time transaction table with From/To addresses and amounts
   - Transaction timestamps and formatting

2. **Total Sum Calculation**

   - Automatic calculation of total sum of all received transactions
   - Real-time updates as new transactions arrive
   - BTC formatting with 8 decimal places

3. **Controls Implementation**

   - **Start**: Subscribes to real-time transaction updates via WebSocket
   - **Stop**: Unsubscribes from updates while keeping current list
   - **Reset**: Clears transaction list and resets total sum to zero

4. **Use Case Scenarios**
   - User clicks "Start" → Transactions begin appearing, total sum updates
   - User clicks "Reset" → List cleared, total sum resets to zero
   - User clicks "Stop" → Transactions stop updating, existing data remains
   - User clicks "Start" again → Transactions resume from live feed

### Technical Implementation

- **Real WebSocket Connection**: Direct connection to Blockchain WebSocket API
- **Real-time Updates**: Live transaction data from the Bitcoin network
- **State Management**: React hooks for transaction list and connection status
- **UI Feedback**: Connection status, transaction count, live indicators
- **Data Formatting**: Address truncation, BTC formatting, timestamp display

### WebSocket API Integration

The component connects to the real Blockchain WebSocket API:

- **Endpoint**: `wss://ws.blockchain.info/inv`
- **Subscription**: `unconfirmed_sub` for unconfirmed transactions
- **Unsubscription**: `unconfirmed_unsub` to stop receiving updates
- **Real Data**: Actual Bitcoin transaction data from the network

## 🔮 Future Enhancements

- Chart.js or Recharts integration for analytics
- Real-time data updates
- User authentication
- Backend API integration
- Advanced workspace features
- Export/import functionality
- Theme customization
- Accessibility improvements
- Transaction filtering and search
- Historical transaction data

## 📝 License

This project is part of the DotCode Apps suite.
