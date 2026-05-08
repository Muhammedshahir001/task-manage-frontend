import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, MoreVertical, 
  Trash2, Edit3, Calendar, AlertCircle 
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/GlassCard';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { tasks, fetchTasks, deleteTask, searchQuery, setSearchQuery } = useTasks();
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Management</h1>
          <p className="text-slate-400 mt-1">Organize and track your daily activities.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={20} />
          Create Task
        </button>
      </div>

      <GlassCard className="!p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full !pl-12 pr-4 py-2.5 glass-input"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 rounded-xl">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:outline-none py-2 text-sm text-slate-200 cursor-pointer"
              >
                <option value="All" className="bg-dark-darker">All Status</option>
                <option value="Pending" className="bg-dark-darker">Pending</option>
                <option value="In Progress" className="bg-dark-darker">In Progress</option>
                <option value="Completed" className="bg-dark-darker">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 rounded-xl">
              <AlertCircle size={16} className="text-slate-400" />
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-transparent border-none focus:outline-none py-2 text-sm text-slate-200 cursor-pointer"
              >
                <option value="All" className="bg-dark-darker">All Priority</option>
                <option value="High" className="bg-dark-darker">High</option>
                <option value="Medium" className="bg-dark-darker">Medium</option>
                <option value="Low" className="bg-dark-darker">Low</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task._id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 
                      task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {task.priority} Priority
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => handleEdit(task)}
                         className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                       >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{task.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6">{task.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className={`flex items-center gap-1.5 font-semibold ${
                      task.status === 'Completed' ? 'text-emerald-400' :
                      task.status === 'In Progress' ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {task.status}
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: task.status === 'Completed' ? '100%' : task.status === 'In Progress' ? '50%' : '10%' }}
                      className={`h-full ${
                        task.status === 'Completed' ? 'bg-emerald-500' :
                        task.status === 'In Progress' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-24 glass-card rounded-3xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-200">No tasks found</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Try adjusting your search or filters to find what you're looking for, or create a new task.
          </p>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={editingTask} 
      />
    </div>
  );
};

export default Tasks;
