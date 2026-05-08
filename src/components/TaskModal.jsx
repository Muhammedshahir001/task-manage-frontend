import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Type, AlignLeft, Flag, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTasks } from '../context/TaskContext';
import GlassCard from './GlassCard';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { addTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: new Date(taskToEdit.dueDate).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, formData);
        toast.success('Task updated!');
      } else {
        await addTask(formData);
        toast.success('Task created!');
      }
      onClose();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg z-10"
          >
            <GlassCard hover={false} className="!p-0 overflow-hidden shadow-2xl border-white/20">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-xl font-bold text-white">
                  {taskToEdit ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Type size={14} /> Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design System Update"
                    className="w-full glass-input px-4"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <AlignLeft size={14} /> Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="What needs to be done?"
                    className="w-full glass-input px-4 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Flag size={14} /> Priority
                    </label>
                    <select
                      className="w-full glass-input px-4 appearance-none"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="Low" className="bg-dark-darker">Low</option>
                      <option value="Medium" className="bg-dark-darker">Medium</option>
                      <option value="High" className="bg-dark-darker">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Calendar size={14} /> Due Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full glass-input px-4"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                {taskToEdit && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Status
                    </label>
                    <div className="flex gap-2">
                      {['Pending', 'In Progress', 'Completed'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({...formData, status})}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            formData.status === status 
                              ? 'bg-primary/20 border-primary text-primary' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 mt-4"
                >
                  {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
