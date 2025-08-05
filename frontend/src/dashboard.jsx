import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './components/Home/home';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const COLORS = ['#3b82f6', '#f59e42', '#22c55e'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://52.187.70.171:8443/proxy/3001/';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}api/ticket/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (e) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Build pieData dynamically from all statuses
  const pieData = stats && stats.statusCounts
    ? Object.entries(stats.statusCounts).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value
      }))
    : [];

  // Generate a color palette for statuses
  const STATUS_COLORS = [
    '#3b82f6', '#f59e42', '#22c55e', '#ef4444', '#a21caf', '#eab308', '#0ea5e9', '#6366f1', '#f472b6', '#14b8a6', '#facc15', '#f87171', '#a3e635', '#fbbf24', '#818cf8', '#f43f5e', '#8b5cf6', '#fcd34d', '#4ade80', '#fca5a5'
  ];
  // Map each status to a color
  const statusColorMap = pieData.reduce((acc, item, idx) => {
    acc[item.name] = STATUS_COLORS[idx % STATUS_COLORS.length];
    return acc;
  }, {});

  return (
    <div>
      <Home />
      <div className="absolute right-0 w-5/6 min-h-screen bg-gray-50 p-8 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>
        {loading ? (
          <div>Loading...</div>
        ) : stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Status Pie Chart */}
            <div className="col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Status Overview</h3>
              <PieChart width={280} height={240}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColorMap[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
              {/* Status legend below pie chart */}
              <div className="mt-6 w-full">
                <h4 className="text-md font-semibold mb-2 text-gray-700">Status Legend</h4>
                <ul className="flex flex-wrap gap-4 justify-center">
                  {pieData.map((entry, idx) => (
                    <li key={entry.name} className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: statusColorMap[entry.name] }}></span>
                      <span className="capitalize text-gray-700">{entry.name}</span>
                      <span className="text-gray-500">({entry.value})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center: All Status Cards and Total Tickets */}
            <div className="col-span-1 flex flex-col justify-between">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-2xl shadow-lg p-8 flex flex-col items-center mb-8">
                <FaTicketAlt className="text-5xl mb-2" />
                <h2 className="text-4xl font-bold">{stats.total}</h2>
                <p className="text-lg">Total Tickets</p>
              </div>
              {/* All Status Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="bg-white rounded-xl p-4 flex flex-col items-center shadow">
                    <span className="text-lg font-semibold capitalize">{status.replace(/_/g, ' ')}</span>
                    <span className="text-2xl font-bold text-blue-700">{count}</span>
                  </div>
                ))}
              </div>
              
              {/* Right: Priority Breakdown */}
            <div className="col-span-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Priority Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-600">Critical</span>
                  <span className="font-bold">{stats.critical}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-orange-500">High</span>
                  <span className="font-bold">{stats.high}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-yellow-500">Medium</span>
                  <span className="font-bold">{stats.medium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-600">Low</span>
                  <span className="font-bold">{stats.low}</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;