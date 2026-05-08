import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const getAxiosConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/tasks', getAxiosConfig());
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData) => {
    const response = await axios.post('/api/tasks', taskData, getAxiosConfig());
    setTasks((prev) => [response.data, ...prev]);
    addNotification(`New task added: "${response.data.title}"`);
    return response.data;
  };

  const updateTask = async (id, taskData) => {
    const response = await axios.put(`/api/tasks/${id}`, taskData, getAxiosConfig());
    setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
    return response.data;
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`, getAxiosConfig());
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      loading, 
      searchQuery, 
      setSearchQuery, 
      fetchTasks, 
      addTask, 
      updateTask, 
      deleteTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};
