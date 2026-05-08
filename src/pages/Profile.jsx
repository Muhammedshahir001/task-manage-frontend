import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit3, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import GlassCard from '../components/GlassCard';

const Profile = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const focusScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2024';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account and preferences.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-semibold transition-all">
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="md:col-span-1 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-dark-darker flex items-center justify-center text-5xl font-bold text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-dark-darker text-white hover:scale-110 transition-transform">
              <Edit3 size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mt-6">{user?.name}</h2>
          <p className="text-slate-400 text-sm">Productivity Enthusiast</p>
          <div className="w-full h-px bg-white/5 my-6" />
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Shield size={18} />
            Premium Account
          </div>
        </GlassCard>

        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-6">Account Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Full Name</p>
                  <p className="text-slate-200 font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Address</p>
                  <p className="text-slate-200 font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Member Since</p>
                  <p className="text-slate-200 font-medium">{joinDate}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-6">
            <GlassCard className="text-center">
              <p className="text-2xl font-bold text-white">{completedTasks}</p>
              <p className="text-xs text-slate-400 uppercase mt-1">Tasks Done</p>
            </GlassCard>
            <GlassCard className="text-center">
              <p className="text-2xl font-bold text-white">{focusScore}%</p>
              <p className="text-xs text-slate-400 uppercase mt-1">Focus Score</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
