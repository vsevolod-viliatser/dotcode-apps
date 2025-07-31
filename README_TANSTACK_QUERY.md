# TanStack Query Implementation for Bitcoin Transactions & Workspace

This document describes the refactored Bitcoin Transactions and Interactive Workspace components that now use TanStack Query for better data management, caching, and error handling.

## Overview

The original implementations used manual state management with `useState` and `useEffect` for data handling. The new implementation leverages TanStack Query's powerful features for:

- **Automatic caching** of data
- **Optimistic updates** for real-time data
- **Better error handling** and loading states
- **Separation of concerns** with custom hooks
- **Type safety** throughout the data flow

## Architecture

### 1. QueryClient Setup (`layout.tsx`)

```typescript
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes
        },
      },
    })
);
```

### 2. Custom Hooks

#### `useWebSocketConnection.ts`

Generic WebSocket connection hook that handles:

- Connection lifecycle management
- Automatic subscription/unsubscription for Blockchain API
- Error handling and reconnection logic
- Message parsing and routing

#### `useBitcoinTransactions.ts`

Main hook that combines TanStack Query with WebSocket functionality:

- Uses `useQuery` for transaction data caching
- Uses `useMutation` for reset operations
- Manages WebSocket connection through `useWebSocketConnection`
- Provides real-time data updates through query cache

#### `useWorkspace.ts`

Workspace management hook with TanStack Query:

- Uses `useQuery` for workspace blocks caching
- Uses `useMutation` for block operations (move, resize, delete, reset)
- Manages localStorage persistence automatically
- Provides optimistic updates for better UX

### 3. Utility Functions

#### `utils/bitcoin.ts`

Centralized utility functions for:

- Data transformation (satoshi to BTC conversion)
- Formatting (addresses, timestamps, amounts)
- Transaction parsing from Blockchain API
- Calculations (total sums, etc.)

#### `utils/workspace.ts`

Workspace-specific utilities for:

- Grid snapping calculations
- Z-index management
- Block manipulation operations
- Local storage utilities
- Block validation

## Key Benefits

### 1. **Better Caching**

- Transaction and workspace data cached automatically
- Configurable stale time and garbage collection
- Optimistic updates for real-time data

### 2. **Improved Error Handling**

- Centralized error states
- Automatic retry logic
- Better user feedback

### 3. **Type Safety**

- Full TypeScript support throughout
- Proper typing for all data structures
- Compile-time error checking

### 4. **Separation of Concerns**

- WebSocket logic separated from UI
- Data transformation logic in utilities
- Reusable hooks for different use cases

### 5. **Developer Experience**

- React Query DevTools for debugging
- Better loading states
- Optimistic updates

## Usage Examples

### Bitcoin Transactions

```typescript
const BitcoinTransactions: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const {
    transactions,
    totalSum,
    isConnected,
    isLoading,
    connectionError,
    startWebSocket,
    stopWebSocket,
    resetTransactions,
  } = useBitcoinTransactions({
    enabled: isEnabled,
    maxTransactions: 50,
  });

  // Component logic...
};
```

### Interactive Workspace

```typescript
const InteractiveWorkspace: React.FC = () => {
  const {
    visibleBlocks,
    isLoading,
    error,
    moveBlock,
    resizeBlock,
    bringToFront,
    deleteBlock,
    resetBlocks,
  } = useWorkspace();

  // Component logic...
};
```

## Data Flow

### Bitcoin Transactions

1. **Initialization**: QueryClient is set up in the layout
2. **Connection**: WebSocket connection is established when enabled
3. **Data Reception**: Incoming transactions are parsed and cached
4. **UI Updates**: Component re-renders with cached data
5. **Cache Management**: TanStack Query handles data freshness and cleanup

### Interactive Workspace

1. **Initialization**: QueryClient loads blocks from localStorage
2. **User Interaction**: Block operations trigger mutations
3. **Optimistic Updates**: UI updates immediately for better UX
4. **Persistence**: Changes are automatically saved to localStorage
5. **Cache Management**: TanStack Query handles data synchronization

## Configuration Options

### QueryClient Configuration

- `staleTime`: How long data is considered fresh (5 minutes)
- `gcTime`: How long to keep unused data in cache (10 minutes)

### Bitcoin Transactions Hook Options

- `enabled`: Whether to start the WebSocket connection
- `maxTransactions`: Maximum number of transactions to keep in cache

### Workspace Hook Features

- Automatic localStorage persistence
- Grid snapping utilities
- Z-index management
- Block validation

## Migration Benefits

### Before (Manual State Management)

- Complex state synchronization
- Manual error handling
- No caching
- Difficult to test
- Tight coupling between UI and data logic

### After (TanStack Query)

- Automatic caching and synchronization
- Built-in error handling
- Optimistic updates
- Easy testing with query mocking
- Clean separation of concerns

## Future Enhancements

### Bitcoin Transactions

1. **Background Sync**: Implement background data synchronization
2. **Offline Support**: Cache data for offline viewing
3. **Pagination**: Handle large transaction lists
4. **Filters**: Add transaction filtering capabilities
5. **Real-time Charts**: Integrate with charting libraries

### Interactive Workspace

1. **Undo/Redo**: Implement undo/redo functionality
2. **Collaboration**: Real-time collaboration features
3. **Templates**: Pre-built workspace templates
4. **Export/Import**: Save and load workspace configurations
5. **Advanced Grid**: Configurable grid systems

## Testing

The new implementation makes testing much easier:

```typescript
// Mock the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Test Bitcoin Transactions with mocked data
queryClient.setQueryData(["bitcoin-transactions"], mockTransactions);

// Test Workspace with mocked blocks
queryClient.setQueryData(["workspace-blocks"], mockBlocks);
```

## Performance Improvements

### Bitcoin Transactions

- **Reduced Re-renders**: Only re-render when data actually changes
- **Background Updates**: WebSocket updates don't block UI
- **Memory Management**: Automatic garbage collection of old data

### Interactive Workspace

- **Optimistic Updates**: UI responds immediately to user actions
- **Efficient Persistence**: Only save when data actually changes
- **Smart Caching**: Cache workspace state for faster loading

This refactoring significantly improves the maintainability, performance, and developer experience of both the Bitcoin Transactions and Interactive Workspace features.
