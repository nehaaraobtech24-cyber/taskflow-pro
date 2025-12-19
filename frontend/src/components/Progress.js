import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllTasks } from '../services/api';
import './Progress.css';

function Progress() {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;

  const getAchievements = () => {
    const achievements = [];
    
    if (completedTasks >= 1) achievements.push({ icon: '🌱', title: 'First Task', desc: 'Complete your first task' });
    if (completedTasks >= 5) achievements.push({ icon: '🌿', title: 'Getting Started', desc: 'Complete 5 tasks' });
    if (completedTasks >= 10) achievements.push({ icon: '🪴', title: 'Growing Strong', desc: 'Complete 10 tasks' });
    if (completedTasks >= 20) achievements.push({ icon: '🌳', title: 'Task Master', desc: 'Complete 20 tasks' });
    if (completedTasks >= 50) achievements.push({ icon: '🌲', title: 'Productivity Legend', desc: 'Complete 50 tasks' });
    
    return achievements;
  };

  const achievements = getAchievements();

  return (
    <div className="progress-container">
      {/* Header */}
      <header className="progress-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
        <div className="header-right">
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* User Stats Card */}
      <div className="stats-card">
        <h1>📊 Your Progress</h1>
        <p className="username">Hello, {user?.username}! 👋</p>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-item completed">
            <div className="stat-number">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item in-progress">
            <div className="stat-number">{inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-item pending">
            <div className="stat-number">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="priority-card">
        <h2>🎯 Priority Breakdown</h2>
        <div className="priority-bars">
          <div className="priority-bar-item">
            <div className="priority-bar-header">
              <span>High Priority</span>
              <span>{highPriorityTasks}</span>
            </div>
            <div className="priority-bar-bg">
              <div 
                className="priority-bar-fill high" 
                style={{ width: tasks.length > 0 ? `${(highPriorityTasks / tasks.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          <div className="priority-bar-item">
            <div className="priority-bar-header">
              <span>Medium Priority</span>
              <span>{mediumPriorityTasks}</span>
            </div>
            <div className="priority-bar-bg">
              <div 
                className="priority-bar-fill medium" 
                style={{ width: tasks.length > 0 ? `${(mediumPriorityTasks / tasks.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          <div className="priority-bar-item">
            <div className="priority-bar-header">
              <span>Low Priority</span>
              <span>{lowPriorityTasks}</span>
            </div>
            <div className="priority-bar-bg">
              <div 
                className="priority-bar-fill low" 
                style={{ width: tasks.length > 0 ? `${(lowPriorityTasks / tasks.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-card">
        <h2>🏆 Achievements Unlocked</h2>
        {achievements.length === 0 ? (
          <p className="no-achievements">Complete tasks to unlock achievements!</p>
        ) : (
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plant Garden */}
      <div className="garden-card">
        <h2>🌳 Your Plant Garden</h2>
        <p>Plant Stage: {user?.plantStage || 0}</p>
        <div className="garden-display">
          {Array.from({ length: Math.min(user?.plantStage || 0, 10) }).map((_, i) => (
            <span key={i} className="garden-plant">
              {i < 2 ? '🌱' : i < 4 ? '🌿' : i < 6 ? '🪴' : i < 8 ? '🌳' : '🌲'}
            </span>
          ))}
          {(user?.plantStage || 0) === 0 && (
            <p className="empty-garden">Complete tasks to grow your garden! 🌱</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;