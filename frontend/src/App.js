import React, { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please check if the backend is running.');
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      setError('');
      const response = await api.createTask({ title: input, description: '' });
      setTasks([response.data, ...tasks]);
      setInput('');
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const toggleTask = async (task) => {
    try {
      setError('');
      const response = await api.updateTask(task.id, {
        ...task,
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      setError('');
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo Application</h1>
        <p>Assignment 3 - GitHub Actions CI/CD Pipeline</p>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
          />
          <button type="submit" className="add-button">
            Add Task
          </button>
        </form>

        <div className="tasks-container">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one to get started!</p>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                      className="task-checkbox"
                    />
                    <span className="task-title">{task.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
