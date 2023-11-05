import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:3001/tasks');
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    const response = await axios.post('http://localhost:3001/tasks', {
      title: newTask,
      description: description,
      status: 'pending', //par défaut
    });
    const data = response.data;
    setTasks([data, ...tasks]);
    setNewTask('');
    setDescription('');
  };

  const updateTask = async (id, updatedTask) => {
    await axios.put(`http://localhost:3001/tasks/${id}`, updatedTask);
    setEditingTask(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    fetchTasks();
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') {
        return 1;
      }
      if (b.status === 'completed' && a.status !== 'completed') {
        return -1;
      }
      return 0;
    });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      {editingTask ? (
        <div className="edit-task">
          <h2>Edit Task</h2>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
          />
          <textarea
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
          />
          <select
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={() => updateTask(editingTask.id, editingTask)}>Save</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="task-input">
            <input
              type="text"
              placeholder="Title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
          </div>
          <div className="filter-buttons">
            <button onClick={() => setStatusFilter('all')}>All</button>
            <button onClick={() => setStatusFilter('pending')}>Pending</button>
            <button onClick={() => setStatusFilter('in progress')}>In Progress</button>
            <button onClick={() => setStatusFilter('completed')}>Completed</button>
          </div>
          <ul className="task-list">
            {sortTasks(tasks)
              .filter((task) => statusFilter === 'all' || task.status === statusFilter)
              .map((task) => (
                <li key={task.id}>
                  <span className={`status-${task.status}`}>{task.title}</span>
                  <button onClick={() => setEditingTask(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;

