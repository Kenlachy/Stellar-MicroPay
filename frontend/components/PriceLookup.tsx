'use client';

import React, { useState, useEffect } from 'react';
import { fetchOrderbook, calculatePriceInfo, StellarAsset, PriceInfo, COMMON_ASSETS } from '../lib/stellar';

interface PriceLookupProps {
  className?: string;
}

export default function PriceLookup({ className = '' }: PriceLookupProps) {
  const [baseAsset, setBaseAsset] = useState<StellarAsset>(COMMON_ASSETS.XLM);
  const [counterAsset, setCounterAsset] = useState<StellarAsset>(COMMON_ASSETS.USDC);
  const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = async () => {
    if (!baseAsset.code || !counterAsset.code) {
      setError('Please select both assets');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderbook = await fetchOrderbook(baseAsset, counterAsset);
      const priceData = calculatePriceInfo(orderbook);
      
      if (priceData) {
        setPriceInfo(priceData);
        setLastUpdated(new Date());
      } else {
        setError('No price data available for this pair');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchPrice();
    
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, [baseAsset, counterAsset]);

  const handleSwap = () => {
    setBaseAsset(counterAsset);
    setCounterAsset(baseAsset);
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(6);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Stellar DEX Price Lookup</h2>
      
      {/* Asset Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Asset (Sell)
          </label>
          <select
            value={`${baseAsset.code}:${baseAsset.issuer || ''}`}
            onChange={(e) => {
              const [code, issuer] = e.target.value.split(':');
              setBaseAsset({ code, issuer: issuer || undefined });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(COMMON_ASSETS).map(([key, asset]) => (
              <option key={key} value={`${asset.code}:${asset.issuer || ''}`}>
                {asset.code} {asset.issuer ? `(Custom)` : '(Native)'}
              </option>
            ))}
          </select>
          {baseAsset.issuer && (
            <input
              type="text"
              placeholder="Issuer address"
              value={baseAsset.issuer}
              onChange={(e) => setBaseAsset({ ...baseAsset, issuer: e.target.value })}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Counter Asset (Buy)
          </label>
          <select
            value={`${counterAsset.code}:${counterAsset.issuer || ''}`}
            onChange={(e) => {
              const [code, issuer] = e.target.value.split(':');
              setCounterAsset({ code, issuer: issuer || undefined });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(COMMON_ASSETS).map(([key, asset]) => (
              <option key={key} value={`${asset.code}:${asset.issuer || ''}`}>
                {asset.code} {asset.issuer ? `(Custom)` : '(Native)'}
              </option>
            ))}
          </select>
          {counterAsset.issuer && (
            <input
              type="text"
              placeholder="Issuer address"
              value={counterAsset.issuer}
              onChange={(e) => setCounterAsset({ ...counterAsset, issuer: e.target.value })}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwap}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ⇅ Swap Assets
        </button>
      </div>

      {/* Price Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading price data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {priceInfo && !loading && !error && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Bid Price</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(priceInfo.bid)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Mid Price</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatPrice(priceInfo.mid)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Ask Price</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatPrice(priceInfo.ask)}
                </p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>
                {baseAsset.code}/{counterAsset.code}
                {lastUpdated && ` • Updated: ${formatTime(lastUpdated)}`}
              </p>
              <p className="mt-1">Auto-refreshes every 30 seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
