import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
  CheckCircle2, Clock, ListTodo, TrendingUp,
  Plus, ArrowRight, Edit3
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/GlassCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { tasks, fetchTasks, loading, searchQuery } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    
    return [
      { label: 'Total Tasks', value: total, icon: <ListTodo className="text-primary" />, color: '#6366f1' },
      { label: 'Completed', value: completed, icon: <CheckCircle2 className="text-emerald-400" />, color: '#10b981' },
      { label: 'In Progress', value: inProgress, icon: <TrendingUp className="text-amber-400" />, color: '#f59e0b' },
      { label: 'Pending', value: pending, icon: <Clock className="text-rose-400" />, color: '#f43f5e' },
    ];
  }, [tasks]);

  const pieData = useMemo(() => [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
  ], [tasks]);

  const chartData = useMemo(() => {
    return tasks.slice(0, 7).reverse().map(t => ({
      ...t,
      level: t.status === 'Completed' ? 3 : t.status === 'In Progress' ? 2 : 1
    }));
  }, [tasks]);

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Monitor your productivity and task progress.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                {stat.icon}
              </div>
            </div>
            <div 
              className="absolute bottom-0 left-0 h-1 transition-all duration-500" 
              style={{ width: '100%', backgroundColor: stat.color, opacity: 0.3 }} 
            />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Productivity Timeline</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="createdAt" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val === 3 ? 'Done' : val === 2 ? 'Prog' : 'Pend'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelFormatter={(val) => new Date(val).toLocaleString()}
                />
                <Area type="monotone" dataKey="level" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-6 self-start">Task Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-400">{d.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Recent Tasks</h3>
          <button className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {searchQuery ? `No tasks matching "${searchQuery}"` : "No tasks found. Create your first task to see it here!"}
            </div>
          ) : (
            filteredTasks.slice(0, 5).map((task) => (
              <div key={task._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'High' ? 'bg-rose-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-slate-200">{task.title}</h4>
                    <p className="text-xs text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {task.status}
                  </div>
                  <button 
                    onClick={() => handleEdit(task)}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={editingTask} 
      />
    </motion.div>
  );
};

export default Dashboard;
