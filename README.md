# Stellar MicroPay - DEX Price Lookup

A React/Next.js application for Stellar DEX price lookup functionality.

## Features

- **Price Lookup Widget**: Real-time price lookup for any Stellar asset pair using Horizon orderbook API
- **Asset Selection**: Support for native XLM and custom assets with issuer addresses
- **Price Display**: Shows bid, ask, and mid prices with auto-refresh every 30 seconds
- **Swap Functionality**: Easy asset pair reversal with swap button
- **Default Pair**: Pre-populated with XLM/USDC as default

## Project Structure

```
Stellar-MicroPay/
├── frontend/
│   ├── components/
│   │   └── PriceLookup.tsx      # Main price lookup component
│   ├── lib/
│   │   └── stellar.ts           # Stellar API utilities
│   ├── pages/
│   │   ├── dashboard.tsx        # Dashboard page with price widget
│   │   ├── index.tsx            # Home page
│   │   └── _app.tsx             # Next.js app configuration
│   └── styles/
│       └── globals.css          # Global styles
├── demo.html                    # Standalone HTML demo (no build required)
├── package.json                 # Dependencies and scripts
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Implementation Details

### Stellar API Integration (`frontend/lib/stellar.ts`)

- **fetchOrderbook()**: Fetches orderbook data from Horizon `/order_book` endpoint
- **calculatePriceInfo()**: Calculates bid, ask, and mid prices from orderbook data
- **COMMON_ASSETS**: Predefined common Stellar assets (XLM, USDC, USDT, EURT)

### PriceLookup Component (`frontend/components/PriceLookup.tsx`)

- Asset selectors with dropdown and custom issuer input fields
- Real-time price display with loading states
- Auto-refresh every 30 seconds
- Swap button to reverse asset pairs
- Error handling for invalid pairs or API issues

### Dashboard Integration (`frontend/pages/dashboard.tsx`)

- Price lookup widget integrated into main dashboard
- Responsive layout with additional dashboard sections
- Clean, modern UI using Tailwind CSS

## Quick Start (Demo)

1. Open `demo.html` in your browser to test the functionality immediately
2. The demo uses the same functionality as the React component but requires no build process

## Development Setup (Requires Node.js)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select Assets**: Choose base and counter assets from the dropdown
2. **Custom Assets**: For non-native assets, provide the issuer address
3. **View Prices**: See real-time bid, ask, and mid prices
4. **Swap Pairs**: Click the swap button to reverse the asset pair
5. **Auto-Refresh**: Prices automatically update every 30 seconds

## API Endpoints Used

- **Horizon Orderbook**: `https://horizon.stellar.org/order_book`
- **Parameters**: `selling_asset` and `buying_asset` in format `{code}:{issuer}`

## Supported Assets

- **XLM**: Native Stellar asset
- **USDC**: USD Coin (issuer: GA5ZSEJYB37JRC5AVCIA5MOP4RHTM3LXUU7EGZEFJX4M7Q6VKMCKM3G6)
- **USDT**: Tether USD (issuer: GDOT5XLVJUPYKJRN3JZ4GQHPUVFMNIFZJEGLAY4M4FJTCRQJNLKCHQ2M)
- **EURT**: Euro Token (issuer: GAP5LETOV6YIEVYWSNY6QXRYCQSFC3GRCPV6M5HCHYAU4AKH2F7M4R6I)

## Error Handling

- Invalid asset pairs show appropriate error messages
- Network errors are handled gracefully
- Empty orderbooks display "No price data available"

## Future Enhancements

- Historical price charts
- Price alerts
- Portfolio tracking
- Transaction history integration
