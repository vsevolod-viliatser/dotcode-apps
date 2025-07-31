export interface BitcoinTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  hash: string;
  inputs?: Array<{ prev_out: { addr: string; value: number } }>;
  out?: Array<{ addr: string; value: number }>;
}
