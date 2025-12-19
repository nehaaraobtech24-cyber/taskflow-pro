import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllTasks } from '../services/api';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { format, parseISO, isToday, isSameDay } from 'date-fns';
import ParticleBackground from './ParticleBackground';
import PageTransition from './PageTransition';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (task.dueDate) {
        const taskDate = parseISO(task.dueDate);
        return isSameDay(taskDate, date);
      }
      return false;
    });
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="calendar-task-indicator">
            <span className="task-count">{dayTasks.length}</span>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (isToday(date)) return 'today-tile';
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) return 'has-tasks-tile';
    }
    return null;
  };

  if (loading) return <div className="loading">Loading calendar...</div>;

  return (
    <PageTransition>
      <div className="calendar-container">
        <ParticleBackground />

        {/* Header */}
        <motion.header 
          className="calendar-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>📅 Calendar View</h1>
            <p>Visualize your tasks by date</p>
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
              onClick={() => navigate('/analytics')} 
              className="analytics-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📈 Analytics
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

        <div className="calendar-content">
          {/* Calendar Section */}
          <motion.div 
            className="calendar-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </motion.div>

          {/* Tasks for Selected Date */}
          <motion.div 
            className="tasks-for-date"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h2>
            
            {tasksForSelectedDate.length === 0 ? (
              <div className="no-tasks-message">
                <p>📭 No tasks scheduled for this day</p>
                <p>Create tasks with due dates to see them here!</p>
              </div>
            ) : (
              <div className="date-tasks-list">
                {tasksForSelectedDate.map((task) => (
                  <motion.div 
                    key={task._id} 
                    className={`date-task-card priority-${task.priority} status-${task.status}`}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-status-row">
                      <span className={`status-badge ${task.status}`}>{task.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="calendar-stats"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="stat-box">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <div className="stat-number">{tasks.filter(t => t.dueDate).length}</div>
              <div className="stat-label">Scheduled Tasks</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-number">{tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default CalendarView;