import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaCalendarAlt, FaChartLine, FaFilter } from 'react-icons/fa';
import * as adminAPI from '../../api/adminAPI';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState('week');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    loadSalesData();
  }, [filter]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      // Get analytics data which includes ordersPerDay
      const response = await adminAPI.getAnalytics();
      
      if (response.data?.data || response.data) {
        const data = response.data?.data || response.data;
        
        // Use ordersPerDay from analytics or generate mock data
        const ordersPerDay = data.ordersPerDay || generateMockData();
        formatChartData(ordersPerDay);
      } else {
        // Use mock data if API doesn't return data
        const mockData = generateMockData();
        formatChartData(mockData);
      }
    } catch (error) {
      console.error('Error loading sales data:', error);
      // Use mock data on error
      const mockData = generateMockData();
      formatChartData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock data based on filter
    switch (filter) {
      case 'day':
        return [8, 12, 15, 20, 25, 18, 14, 10];
      case 'week':
        return [10, 15, 20, 25, 30, 22, 18];
      case 'month':
        return [120, 150, 180, 200];
      case 'year':
        return [100, 120, 150, 180, 200, 220, 240, 210, 190, 170, 150, 130];
      default:
        return [10, 15, 20, 25, 30, 22, 18];
    }
  };

  const formatChartData = (ordersData) => {
    const labels = getLabelsByFilter();
    
    // Adjust data length to match labels
    let adjustedOrdersData = ordersData;
    if (ordersData.length !== labels.length) {
      adjustedOrdersData = labels.map((_, index) => ordersData[index] || Math.floor(Math.random() * 30 + 10));
    }
    
    // Generate sales data based on orders (mock calculation)
    const salesData = adjustedOrdersData.map(orders => orders * 47.50); // Average order value
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Sales ($)',
          data: salesData,
          borderColor: 'rgb(250, 204, 21)',
          backgroundColor: chartType === 'line' ? 'rgba(250, 204, 21, 0.1)' : 'rgba(250, 204, 21, 0.6)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Orders',
          data: adjustedOrdersData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: chartType === 'line' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.6)',
          tension: 0.4,
          fill: true
        }
      ]
    };
    
    setChartData(data);
  };

  const getLabelsByFilter = () => {
    switch (filter) {
      case 'day':
        return ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Sales Overview - ${filter.charAt(0).toUpperCase() + filter.slice(1)}`,
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Sales ($)') {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaChartLine className="text-yellow-400" />
          Sales Analytics
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {/* Chart Type Toggle */}
          <div className="flex gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                chartType === 'line' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Bar
            </button>
          </div>

          {/* Time Filter */}
          <div className="flex gap-2">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setFilter(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  filter === period 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setFilter('custom')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                filter === 'custom' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              <FaCalendarAlt /> Custom
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {filter === 'custom' && (
        <div className="flex gap-3 mb-4">
          <input
            type="date"
            value={customRange.startDate}
            onChange={(e) => setCustomRange({...customRange, startDate: e.target.value})}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
          />
          <input
            type="date"
            value={customRange.endDate}
            onChange={(e) => setCustomRange({...customRange, endDate: e.target.value})}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      )}

      {/* Chart */}
      <div className="h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-4xl text-yellow-400">⚡</div>
          </div>
        ) : chartData ? (
          chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {chartData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Total Sales</p>
            <p className="text-xl font-bold text-yellow-400">
              ${chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-xl font-bold text-blue-400">
              {chartData.datasets[1].data.reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Avg Order Value</p>
            <p className="text-xl font-bold text-green-400">
              ${(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[1].data.reduce((a, b) => a + b, 0)).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Peak Sales</p>
            <p className="text-xl font-bold text-purple-400">
              ${Math.max(...chartData.datasets[0].data).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
