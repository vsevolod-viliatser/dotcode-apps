import { BitcoinTransaction } from "@/types/btc";

export const satoshiToBTC = (satoshi: number): string => {
  return (satoshi / 100000000).toFixed(8);
};

export const formatBTC = (amount: number): string => {
  return `${amount.toFixed(8)} BTC`;
};

export const formatAddress = (address: string): string => {
  if (address.length > 40) {
    return `${address.substring(0, 20)}...${address.substring(
      address.length - 20
    )}`;
  }
  return address;
};

export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString();
};

export const calculateTotalSum = (
  transactions: BitcoinTransaction[]
): number => {
  return transactions.reduce((acc, tx) => acc + tx.amount, 0);
};

export const parseBlockchainTransaction = (
  data: unknown
): BitcoinTransaction | null => {
  try {
    if (
      data &&
      typeof data === "object" &&
      "x" in data &&
      data.x &&
      typeof data.x === "object" &&
      "hash" in data.x
    ) {
      const tx = data.x as {
        hash: string;
        inputs?: Array<{ prev_out: { addr: string; value: number } }>;
        out?: Array<{ addr: string; value: number }>;
        time: number;
      };
      const inputs = tx.inputs || [];
      const outputs = tx.out || [];

      // Calculate total output value (we only need this for display)
      const outputValue = outputs.reduce((sum: number, output) => {
        return sum + (output.value || 0);
      }, 0);

      const fromAddress = inputs[0]?.prev_out?.addr || "Unknown";
      const toAddress = outputs[0]?.addr || "Unknown";

      return {
        id: tx.hash,
        from: fromAddress,
        to: toAddress,
        amount: parseFloat(satoshiToBTC(outputValue)),
        timestamp: new Date(tx.time * 1000),
        hash: tx.hash,
        inputs: inputs,
        out: outputs,
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing transaction:", error);
    return null;
  }
};
