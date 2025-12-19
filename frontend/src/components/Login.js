import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import PageTransition from './PageTransition';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition>
      <div className="login-container">
        <ParticleBackground />
        <motion.div 
          className="login-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <motion.div 
            className="login-header"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="plant-icon"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🌱
            </motion.div>
            <h1>TaskFlow Pro</h1>
            <p>Grow your productivity, one task at a time</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="login-form"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="input-group">
              <label>Enter Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <motion.button 
              type="submit" 
              className="login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Growing 🌿
            </motion.button>
          </motion.form>

          <motion.div 
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p>✨ Complete tasks to grow your virtual plant!</p>
            <p>🏆 Track your progress and achievements</p>
            <p>🌳 Watch your garden flourish</p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Login;