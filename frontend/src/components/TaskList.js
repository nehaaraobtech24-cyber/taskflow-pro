import React, { useState, useEffect } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);

  // Fetch tasks when component loads
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
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="task-container">
      <h1>TaskFlow Pro</h1>

      {/* Create Task Form */}
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
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first task above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-card priority-${task.priority} status-${task.status}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
              </div>
              {task.description && <p className="task-description">{task.description}</p>}
              <div className="task-footer">
                <button
                  onClick={() => handleStatusChange(task._id, task.status)}
                  className={`status-btn ${task.status}`}
                >
                  {task.status}
                </button>
                <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;