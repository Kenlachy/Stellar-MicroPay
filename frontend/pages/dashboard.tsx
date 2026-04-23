import React from 'react';
import PriceLookup from '../components/PriceLookup';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MicroPay Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Lookup Widget */}
          <div className="lg:col-span-1">
            <PriceLookup />
          </div>
          
          {/* Other dashboard content can go here */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Account Overview</h2>
              <p className="text-gray-600">
                Your Stellar account information and recent transactions will appear here.
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional dashboard sections */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">
              Your recent payment activities and transaction history will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
