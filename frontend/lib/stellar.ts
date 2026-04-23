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
 * Common Stellar assets for convenience
 */
export const COMMON_ASSETS: Record<string, StellarAsset> = {
  XLM: { code: 'XLM' },
  USDC: { code: 'USDC', issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM3LXUU7EGZEFJX4M7Q6VKMCKM3G6' },
  USDT: { code: 'USDT', issuer: 'GDOT5XLVJUPYKJRN3JZ4GQHPUVFMNIFZJEGLAY4M4FJTCRQJNLKCHQ2M' },
  EURT: { code: 'EURT', issuer: 'GAP5LETOV6YIEVYWSNY6QXRYCQSFC3GRCPV6M5HCHYAU4AKH2F7M4R6I' }
};
