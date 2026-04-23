import React, { useState, useEffect } from 'react';
import { fetchNetworkFeeStats, classifyNetworkStatus, NetworkStatus, NetworkFeeStats } from '../lib/stellar';

interface NetworkStatusIndicatorProps {
  status: NetworkStatus;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'elevated':
        return 'bg-amber-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'normal':
        return 'Network: Normal';
      case 'elevated':
        return 'Network: Elevated';
      case 'high':
        return 'Network: High';
      default:
        return 'Network: Unknown';
    }
  };

  return (
    <div className="group relative">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {getStatusText()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('normal');
  const [loading, setLoading] = useState<boolean>(true);

  const updateNetworkStatus = async () => {
    try {
      setLoading(true);
      const feeStats: NetworkFeeStats = await fetchNetworkFeeStats();
      const status: NetworkStatus = classifyNetworkStatus(feeStats);
      setNetworkStatus(status);
    } catch (error) {
      console.error('Failed to update network status:', error);
      setNetworkStatus('normal'); // Default to normal on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    updateNetworkStatus();

    // Set up interval to refresh every 60 seconds
    const interval = setInterval(updateNetworkStatus, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Stellar MicroPay</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Network Status Indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Network Status:</span>
              {loading ? (
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
              ) : (
                <NetworkStatusIndicator status={networkStatus} />
              )}
            </div>
            
            {/* Additional nav items can be added here */}
            <div className="text-sm text-gray-600">
              Dashboard
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
