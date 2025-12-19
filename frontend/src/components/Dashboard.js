import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ParticleBackground from './ParticleBackground';
import PageTransition from './PageTransition';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, updateUserProgress } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
      const completedCount = data.filter(t => t.status === 'completed').length;
      updateUserProgress(completedCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '', priority: 'medium', status: 'pending' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = ['pending', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await updateTask(id, { status: newStatus });
      
      if (newStatus === 'completed') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
        });
      }
      
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPlantEmoji = (stage) => {
    const plants = ['🌱', '🌿', '🪴', '🌳', '🌲', '🌴', '🌺', '🌸'];
    return plants[Math.min(stage, plants.length - 1)];
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (loading) return <div className="loading">Loading your garden...</div>;

  return (
    <PageTransition>
      <div className="dashboard-container">
        <ParticleBackground />
        
        {/* Header */}
        <motion.header 
          className="dashboard-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>🌿 TaskFlow Pro</h1>
            <p>Welcome back, {user?.username}!</p>
          </div>
          <div className="header-right">
            <motion.button 
              onClick={toggleDarkMode} 
              className="theme-toggle-btn"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
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
              onClick={() => navigate('/analytics')} 
              className="analytics-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📈 Analytics
            </motion.button>
            <motion.button 
              onClick={() => navigate('/progress')} 
              className="progress-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 Progress
            </motion.button>
            <motion.button 
              onClick={logout} 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
            <motion.button 
  onClick={() => navigate('/goals')} 
  className="goals-btn"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  🎯 Goals
</motion.button>
          </div>
        </motion.header>

        {/* Plant Growth Section */}
        <motion.div 
          className="plant-section"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="plant-display">
            <motion.div 
              className="plant-emoji"
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity
              }}
            >
              {getPlantEmoji(user?.plantStage || 0)}
            </motion.div>
            <h2>Your Plant: Stage {user?.plantStage || 0}</h2>
            <p>{completedTasks} tasks completed</p>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="progress-text">{completedTasks} / {totalTasks} tasks done</p>
          </div>
        </motion.div>

        {/* Task Section */}
        <motion.div 
          className="task-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Task Form */}
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Task
            </motion.button>
          </form>

          {/* Task List */}
          <div className="tasks-grid">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div 
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p>🌱 {searchTerm ? 'No tasks found.' : 'No tasks yet. Plant your first seed by creating a task!'}</p>
                </motion.div>
              ) : (
                filteredTasks.map((task) => (
                  <motion.div 
                    key={task._id} 
                    className={`task-card priority-${task.priority} status-${task.status}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
                    layout
                  >
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-footer">
                      <motion.button
                        onClick={() => handleStatusChange(task._id, task.status)}
                        className={`status-btn ${task.status}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {task.status}
                      </motion.button>
                      <motion.button 
                        onClick={() => handleDeleteTask(task._id)} 
                        className="delete-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Dashboard;