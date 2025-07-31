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

  const handleWebSocketOpen = useCallback(() => {}, []);

  const handleWebSocketClose = useCallback(() => {}, []);

  const { isConnected, connectionError, connect, disconnect } =
    useWebSocketConnection({
      url: "wss://ws.blockchain.info/inv",
      enabled,
      onMessage: handleWebSocketMessage,
      onOpen: handleWebSocketOpen,
      onClose: handleWebSocketClose,
    });

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

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<BitcoinTransaction[]>({
    queryKey: ["bitcoin-transactions"],
    queryFn: () => [],
    enabled: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });

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
