"use client";

import { useBitcoinTransactions } from "@/hooks/useBitcoinTransactions";
import { formatAddress, formatBTC, formatTimestamp } from "@/utils/bitcoin";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const BitcoinTransactions: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const {
    transactions,
    totalSum,
    isConnected,
    isLoading,
    connectionError,
    resetTransactions,
  } = useBitcoinTransactions({
    enabled: isEnabled,
    maxTransactions: 50,
  });

  const handleStart = () => {
    setIsEnabled(true);
  };

  const handleStop = () => {
    setIsEnabled(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bitcoin Transactions
        </h1>
        <p className="text-gray-600">
          Real-time Bitcoin transaction tracker using Blockchain WebSocket API.
          Monitor live unconfirmed transactions and track total amounts.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={handleStart}
              disabled={isConnected || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isConnected || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                "Start"
              )}
            </button>

            <button
              onClick={handleStop}
              disabled={!isConnected}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !isConnected
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Stop
            </button>

            <button
              onClick={resetTransactions}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Status:
              <span
                className={`ml-2 font-medium ${
                  isConnected ? "text-green-600" : "text-red-600"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Transactions:{" "}
              <span className="font-medium">{transactions.length}</span>
            </div>
          </div>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              <span className="font-medium">Connection Error:</span>{" "}
              {connectionError}
            </p>
          </div>
        )}
      </div>

      {/* Total Sum Display */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Total Sum</h2>
          <div className="text-4xl font-bold text-green-600">
            {formatBTC(totalSum)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Sum of all received transactions
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Live Unconfirmed Transactions
          </h3>
          {isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-500">
              Click &quot;Start&quot; to begin receiving live unconfirmed
              transactions
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      index === 0 ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {formatAddress(transaction.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {formatAddress(transaction.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatBTC(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(transaction.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {formatAddress(transaction.hash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Connection Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Connection Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">WebSocket Endpoint:</p>
            <p className="font-mono text-gray-900">
              wss://ws.blockchain.info/inv
            </p>
          </div>
          <div>
            <p className="text-gray-600">Subscription:</p>
            <p className="font-mono text-gray-900">unconfirmed_sub</p>
          </div>
          <div>
            <p className="text-gray-600">Last Update:</p>
            <p className="text-gray-900">
              {transactions.length > 0
                ? formatTimestamp(transactions[0].timestamp)
                : "Never"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Transaction Count:</p>
            <p className="text-gray-900">{transactions.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(BitcoinTransactions), {
  ssr: false,
});
