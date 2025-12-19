import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllGoals, createGoal, updateGoal, deleteGoal, incrementGoal } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ParticleBackground from './ParticleBackground';
import PageTransition from './PageTransition';
import './Goals.css';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'weekly',
    targetCount: 5,
    endDate: ''
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getAllGoals();
      setGoals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.endDate) return;

    try {
      await createGoal(newGoal);
      setNewGoal({
        title: '',
        description: '',
        type: 'weekly',
        targetCount: 5,
        endDate: ''
      });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleIncrement = async (id) => {
    try {
      const updatedGoal = await incrementGoal(id);
      
      if (updatedGoal.completed && updatedGoal.currentCount === updatedGoal.targetCount) {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#ffd700']
        });
      }
      
      fetchGoals();
    } catch (error) {
      console.error('Error incrementing goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  };

  if (loading) return <div className="loading">Loading goals...</div>;

  return (
    <PageTransition>
      <div className="goals-container">
        <ParticleBackground />

        {/* Header */}
        <motion.header 
          className="goals-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>🎯 Goals</h1>
            <p>Set and track your productivity goals</p>
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
              onClick={logout} 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.header>

        {/* Create Goal Button */}
        <motion.div 
          className="create-goal-section"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button 
            onClick={() => setShowForm(!showForm)} 
            className="create-goal-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? '✕ Cancel' : '+ Create New Goal'}
          </motion.button>
        </motion.div>

        {/* Goal Creation Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              className="goal-form-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3>Create New Goal</h3>
              <form onSubmit={handleCreateGoal}>
                <div className="form-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Complete 10 tasks this week"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea
                    placeholder="Add more details about your goal..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Goal Type</label>
                    <select
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target Count</label>
                    <input
                      type="number"
                      min="1"
                      value={newGoal.targetCount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetCount: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={newGoal.endDate}
                      onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  className="submit-goal-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Goal 🎯
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Grid */}
        <div className="goals-grid">
          <AnimatePresence>
            {goals.length === 0 ? (
              <motion.div 
                className="no-goals"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>🎯 No goals yet. Create your first goal to get started!</p>
              </motion.div>
            ) : (
              goals.map((goal) => (
                <motion.div 
                  key={goal._id} 
                  className={`goal-card ${goal.completed ? 'completed' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <span className={`goal-type-badge ${goal.type}`}>{goal.type}</span>
                  </div>

                  {goal.description && <p className="goal-description">{goal.description}</p>}

                  <div className="goal-progress">
                    <div className="progress-info">
                      <span className="progress-text">{goal.currentCount} / {goal.targetCount}</span>
                      <span className="time-remaining">{getTimeRemaining(goal.endDate)}</span>
                    </div>
                    <div className="progress-bar-container">
                      <motion.div 
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(goal.currentCount, goal.targetCount)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="progress-percentage">
                      {Math.round(getProgressPercentage(goal.currentCount, goal.targetCount))}% Complete
                    </div>
                  </div>

                  {goal.completed && (
                    <div className="completed-badge">
                      ✅ Goal Completed!
                    </div>
                  )}

                  <div className="goal-actions">
                    {!goal.completed && (
                      <motion.button 
                        onClick={() => handleIncrement(goal._id)} 
                        className="increment-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        + Add Progress
                      </motion.button>
                    )}
                    <motion.button 
                      onClick={() => handleDeleteGoal(goal._id)} 
                      className="delete-goal-btn"
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
      </div>
    </PageTransition>
  );
}

export default Goals;