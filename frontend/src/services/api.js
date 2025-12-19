import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Get all tasks
export const getAllTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single task
export const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new task
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
// ===== GOALS API =====

const GOALS_URL = 'http://localhost:5000/api/goals';

// Get all goals
export const getAllGoals = async () => {
  const response = await axios.get(GOALS_URL);
  return response.data;
};

// Get single goal
export const getGoalById = async (id) => {
  const response = await axios.get(`${GOALS_URL}/${id}`);
  return response.data;
};

// Create new goal
export const createGoal = async (goalData) => {
  const response = await axios.post(GOALS_URL, goalData);
  return response.data;
};

// Update goal
export const updateGoal = async (id, goalData) => {
  const response = await axios.put(`${GOALS_URL}/${id}`, goalData);
  return response.data;
};

// Delete goal
export const deleteGoal = async (id) => {
  const response = await axios.delete(`${GOALS_URL}/${id}`);
  return response.data;
};

// Increment goal progress
export const incrementGoal = async (id) => {
  const response = await axios.post(`${GOALS_URL}/${id}/increment`);
  return response.data;
};