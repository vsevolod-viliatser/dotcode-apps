import { BitcoinTransaction } from "@/types/btc";
import { calculateTotalSum, parseBlockchainTransaction } from "@/utils/bitcoin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useWebSocketConnection } from "./useWebSocketConnection";

interface UseBitcoinTransactionsOptions {
  enabled?: boolean;
  maxTransactions?: number;
}

export const useBitcoinTransactions = (
  options: UseBitcoinTransactionsOptions = {}
) => {
  const { enabled = false, maxTransactions = 50 } = options;
  const queryClient = useQueryClient();

  const handleWebSocketMessage = useCallback(
    (data: unknown) => {
      if (data && typeof data === "object" && "op" in data) {
        const message = data as { op: string; x?: unknown };

        if (message.op === "unconfirmed_sub") {
          console.log("Subscribed to unconfirmed transactions");
        } else if (message.x) {
          const transaction = parseBlockchainTransaction(data);
          if (transaction) {
            // Update the query cache with new transaction
            queryClient.setQueryData<BitcoinTransaction[]>(
              ["bitcoin-transactions"],
              (oldData) => {
                const currentData = oldData || [];
                return [
                  transaction,
                  ...currentData.slice(0, maxTransactions - 1),
                ];
              }
            );
          }
        }
      }
    },
    [queryClient, maxTransactions]
  );

  const handleWebSocketOpen = useCallback(() => {
    // Subscribe to unconfirmed transactions when connection opens
    // This will be handled by the WebSocket connection hook
  }, []);

  const handleWebSocketClose = useCallback(() => {
    // Unsubscribe when connection closes
    // This will be handled by the WebSocket connection hook
  }, []);

  const { isConnected, connectionError, connect, disconnect } =
    useWebSocketConnection({
      url: "wss://ws.blockchain.info/inv",
      enabled,
      onMessage: handleWebSocketMessage,
      onOpen: handleWebSocketOpen,
      onClose: handleWebSocketClose,
    });

  // Mutation for resetting transactions
  const resetTransactionsMutation = useMutation({
    mutationFn: () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(["bitcoin-transactions"], []);
    },
  });

  const resetTransactions = useCallback(() => {
    resetTransactionsMutation.mutate();
  }, [resetTransactionsMutation]);

  // Query for transactions
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<BitcoinTransaction[]>({
    queryKey: ["bitcoin-transactions"],
    queryFn: () => [], // Initial empty array, data comes from WebSocket
    enabled: false, // We don't want this to refetch automatically
    staleTime: Infinity, // Keep data fresh since it's real-time
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  // Calculate total sum using utility function
  const totalSum = calculateTotalSum(transactions);

  return {
    transactions,
    totalSum,
    isConnected,
    isLoading: isLoading || resetTransactionsMutation.isPending,
    connectionError,
    error,
    startWebSocket: connect,
    stopWebSocket: disconnect,
    resetTransactions,
    resetTransactionsMutation,
  };
};
