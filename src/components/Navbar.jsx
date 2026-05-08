import { useState } from 'react';
import { Menu, Bell, Search, LogOut, Settings, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useTasks();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-dark-darker/80 backdrop-blur-md border-b border-white/5 h-20 flex items-center px-6 lg:px-10 justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-white/5 rounded-xl"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-64 lg:w-96 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-200 placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full border-2 border-dark-darker font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-[-120px] sm:right-0 mt-4 w-[calc(100vw-2rem)] sm:w-80 bg-dark-lighter border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-w-[320px]"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h4 className="font-bold text-white">Notifications</h4>
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary/5' : ''}`}
                        >
                          {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                          <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-slate-400'}`}>{n.text}</p>
                          <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-white/5 bg-white/5">
                    <button className="text-sm text-slate-400 hover:text-white transition-colors">View all notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">Premium User</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-dark-darker flex items-center justify-center font-bold text-primary text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-60 bg-dark-lighter border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5 rounded-t-xl">
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <UserIcon size={18} /> Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings size={18} /> Preferences
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={() => {
                      logout();
                      toast.success("Successfully logged out");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
