import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllTasks } from '../services/api';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ParticleBackground from './ParticleBackground';
import PageTransition from './PageTransition';
import './Analytics.css';

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  // Status Distribution Data
  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#28a745' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#17a2b8' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#ffc107' }
  ];

  // Priority Distribution Data
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#dc3545' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#ffc107' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#28a745' }
  ];

  // Combined Stats Data for Bar Chart
  const combinedData = [
    {
      category: 'Status',
      Completed: tasks.filter(t => t.status === 'completed').length,
      'In Progress': tasks.filter(t => t.status === 'in-progress').length,
      Pending: tasks.filter(t => t.status === 'pending').length
    },
    {
      category: 'Priority',
      High: tasks.filter(t => t.priority === 'high').length,
      Medium: tasks.filter(t => t.priority === 'medium').length,
      Low: tasks.filter(t => t.priority === 'low').length
    }
  ];

  // Productivity Score
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <PageTransition>
      <div className="analytics-container">
        <ParticleBackground />

        {/* Header */}
        <motion.header 
          className="analytics-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>📈 Analytics Dashboard</h1>
            <p>Visualize your productivity data</p>
          </div>
          <div className="header-right">
            <motion.button 
              onClick={() => navigate('/dashboard')} 
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Dashboard
            </motion.button>
            <motion.button 
              onClick={() => navigate('/calendar')} 
              className="calendar-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📅 Calendar
            </motion.button>
            <motion.button 
              onClick={logout} 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Productivity Score */}
        <motion.div 
          className="productivity-score"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="score-circle">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="20" />
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="none" 
                stroke="#667eea" 
                strokeWidth="20"
                strokeDasharray={`${productivityScore * 5.65} 565`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="score-text">
              <div className="score-number">{productivityScore}%</div>
              <div className="score-label">Productivity</div>
            </div>
          </div>
          <div className="score-details">
            <h2>Your Productivity Score</h2>
            <p>You've completed {completedTasks} out of {totalTasks} tasks</p>
            <div className="score-insights">
              {productivityScore >= 80 && <p className="insight success">🎉 Amazing! You're crushing it!</p>}
              {productivityScore >= 50 && productivityScore < 80 && <p className="insight good">👍 Great work! Keep it up!</p>}
              {productivityScore < 50 && productivityScore > 0 && <p className="insight improve">💪 You can do better! Stay focused!</p>}
              {productivityScore === 0 && <p className="insight start">🌱 Start completing tasks to see your score!</p>}
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Status Pie Chart */}
          <motion.div 
            className="chart-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3>Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Priority Pie Chart */}
          <motion.div 
            className="chart-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3>Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <motion.div 
          className="chart-card full-width"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3>Overview Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#28a745" />
              <Bar dataKey="In Progress" fill="#17a2b8" />
              <Bar dataKey="Pending" fill="#ffc107" />
              <Bar dataKey="High" fill="#dc3545" />
              <Bar dataKey="Medium" fill="#ffc107" />
              <Bar dataKey="Low" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="analytics-stats"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="stat-item">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{tasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{tasks.filter(t => t.priority === 'high').length}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Analytics;