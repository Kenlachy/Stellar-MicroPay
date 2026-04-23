export interface StellarAsset {
  code: string;
  issuer?: string;
}

export interface OrderbookData {
  bids: Array<{
    price: string;
    amount: string;
  }>;
  asks: Array<{
    price: string;
    amount: string;
  }>;
}

export interface PriceInfo {
  bid: number;
  ask: number;
  mid: number;
}

export interface NetworkFeeStats {
  fee_charged: {
    min: number;
    max: number;
    mode: number;
    p10: number;
    p20: number;
    p30: number;
    p40: number;
    p50: number;
    p60: number;
    p70: number;
    p80: number;
    p90: number;
    p95: number;
    p99: number;
  };
  max_fee: {
    min: number;
    max: number;
    mode: number;
    p10: number;
    p20: number;
    p30: number;
    p40: number;
    p50: number;
    p60: number;
    p70: number;
    p80: number;
    p90: number;
    p95: number;
    p99: number;
  };
  last_ledger_base_fee: number;
  ledger_capacity_usage: string;
}

export type NetworkStatus = 'normal' | 'elevated' | 'high';

// Horizon API base URL
const HORIZON_URL = 'https://horizon.stellar.org';

/**
 * Fetches orderbook data for a given asset pair from Stellar Horizon API
 * @param base - Base asset (what you're selling)
 * @param counter - Counter asset (what you're buying)
 * @returns Promise<OrderbookData>
 */
export async function fetchOrderbook(base: StellarAsset, counter: StellarAsset): Promise<OrderbookData> {
  const baseAsset = base.issuer ? `${base.code}:${base.issuer}` : base.code;
  const counterAsset = counter.issuer ? `${counter.code}:${counter.issuer}` : counter.code;
  
  const url = `${HORIZON_URL}/order_book?selling_asset=${baseAsset}&buying_asset=${counterAsset}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      bids: data.bids || [],
      asks: data.asks || []
    };
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    throw error;
  }
}

/**
 * Calculates price information from orderbook data
 * @param orderbook - Orderbook data
 * @returns PriceInfo or null if no data
 */
export function calculatePriceInfo(orderbook: OrderbookData): PriceInfo | null {
  if (orderbook.bids.length === 0 || orderbook.asks.length === 0) {
    return null;
  }
  
  const bestBid = parseFloat(orderbook.bids[0].price);
  const bestAsk = parseFloat(orderbook.asks[0].price);
  
  return {
    bid: bestBid,
    ask: bestAsk,
    mid: (bestBid + bestAsk) / 2
  };
}

/**
 * Fetches the current base fee from Stellar Horizon API
 * @returns Promise<number> - Base fee in stroops (1 XLM = 10,000,000 stroops)
 */
export async function fetchBaseFee(): Promise<number> {
  try {
    const response = await fetch(`${HORIZON_URL}/fee_stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the last_ledger_base_fee in stroops
    return data.last_ledger_base_fee || 100; // Default to 100 stroops (0.00001 XLM)
  } catch (error) {
    console.error('Error fetching base fee:', error);
    // Return default fee on error
    return 100;
  }
}

/**
 * Fetches network fee statistics from Stellar Horizon API
 * @returns Promise<NetworkFeeStats>
 */
export async function fetchNetworkFeeStats(): Promise<NetworkFeeStats> {
  try {
    const response = await fetch(`${HORIZON_URL}/fee_stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching network fee stats:', error);
    // Return default values on error
    return {
      fee_charged: {
        min: 100,
        max: 100,
        mode: 100,
        p10: 100,
        p20: 100,
        p30: 100,
        p40: 100,
        p50: 100,
        p60: 100,
        p70: 100,
        p80: 100,
        p90: 100,
        p95: 100,
        p99: 100
      },
      max_fee: {
        min: 100,
        max: 100,
        mode: 100,
        p10: 100,
        p20: 100,
        p30: 100,
        p40: 100,
        p50: 100,
        p60: 100,
        p70: 100,
        p80: 100,
        p90: 100,
        p95: 100,
        p99: 100
      },
      last_ledger_base_fee: 100,
      ledger_capacity_usage: "0.5"
    };
  }
}

/**
 * Classifies network fee status based on the current fee rate
 * @param feeStats - Network fee statistics
 * @returns NetworkStatus
 */
export function classifyNetworkStatus(feeStats: NetworkFeeStats): NetworkStatus {
  const feeInXLM = stroopsToXLM(feeStats.last_ledger_base_fee);
  
  if (feeInXLM < 0.0001) {
    return 'normal';
  } else if (feeInXLM <= 0.001) {
    return 'elevated';
  } else {
    return 'high';
  }
}

/**
 * Converts stroops to XLM
 * @param stroops - Amount in stroops
 * @returns number - Amount in XLM
 */
export function stroopsToXLM(stroops: number): number {
  return stroops / 10000000;
}

/**
 * Common Stellar assets for convenience
 */
export const COMMON_ASSETS: Record<string, StellarAsset> = {
  XLM: { code: 'XLM' },
  USDC: { code: 'USDC', issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM3LXUU7EGZEFJX4M7Q6VKMCKM3G6' },
  USDT: { code: 'USDT', issuer: 'GDOT5XLVJUPYKJRN3JZ4GQHPUVFMNIFZJEGLAY4M4FJTCRQJNLKCHQ2M' },
  EURT: { code: 'EURT', issuer: 'GAP5LETOV6YIEVYWSNY6QXRYCQSFC3GRCPV6M5HCHYAU4AKH2F7M4R6I' }
};
