'use client';

import React, { useState, useEffect } from 'react';
import { fetchBaseFee, stroopsToXLM } from '../lib/stellar';

interface SendPaymentFormProps {
  className?: string;
  onSend?: (recipient: string, amount: string) => void;
}

export default function SendPaymentForm({ className = '', onSend }: SendPaymentFormProps) {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<number>(0.00001); // Default fee in XLM
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current fee from Horizon API
  useEffect(() => {
    const fetchFee = async () => {
      try {
        const feeInStroops = await fetchBaseFee();
        const feeInXLM = stroopsToXLM(feeInStroops);
        setFee(feeInXLM);
      } catch (err) {
        console.error('Failed to fetch fee:', err);
        // Keep default fee on error
      }
    };

    fetchFee();
  }, []);

  // Calculate total amount (amount + fee)
  const calculateTotal = (): string => {
    const amountNum = parseFloat(amount) || 0;
    const total = amountNum + fee;
    return total.toFixed(7); // Show 7 decimal places for precision
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient.trim()) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setError(null);
    
    if (onSend) {
      onSend(recipient.trim(), amount);
    }
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const totalDeducted = calculateTotal();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Send Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setError(null);
            }}
            placeholder="G..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (XLM)
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0"
            step="0.0000001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fee Display */}
        <div className="bg-gray-50 rounded-md p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Network fee:</span>
            <span className="font-medium text-gray-800">
              ~{fee.toFixed(7)} XLM
            </span>
          </div>
          
          {amount && parseFloat(amount) > 0 && (
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Total deducted:</span>
              <span className="font-bold text-gray-900">
                {totalDeducted} XLM
              </span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !recipient.trim() || !amount || parseFloat(amount) <= 0}
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
