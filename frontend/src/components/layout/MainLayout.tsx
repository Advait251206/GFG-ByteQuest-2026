import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Activity, MessageSquare, Menu, LogOut, Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label, active }: any) => (
  <Link
    to={to}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative overflow-hidden",
      active ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-primary/20"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <Icon size={20} className="relative z-10" />
    <span className="relative z-10 font-medium">{label}</span>
  </Link>
);

export const MainLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close sidebar on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Silent Disease
          </h1>
        </div>

        <nav className="space-y-2">
          <SidebarItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={location.pathname === '/'} 
          />
          <SidebarItem 
            to="/analysis" 
            icon={Activity} 
            label="Risk Analysis" 
            active={location.pathname === '/analysis'} 
          />
          <SidebarItem 
            to="/chat" 
            icon={MessageSquare} 
            label="Health AI" 
            active={location.pathname === '/chat'} 
          />
          <SidebarItem 
            to="/settings" 
            icon={SettingsIcon} 
            label="Settings" 
            active={location.pathname === '/settings'} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
            {user ? (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={logout} className="p-2 hover:text-white text-gray-400 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white justify-center">
                    Sign In
                </Link>
            )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
           <Activity size={20} className="text-primary" />
           <span className="font-bold">Silent Disease</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-surface z-50 p-6 flex flex-col md:hidden border-r border-white/10"
            >
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                    <Activity size={20} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Silent Disease
                  </h1>
                </div>
                <nav className="space-y-2">
                  <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
                  <SidebarItem to="/analysis" icon={Activity} label="Risk Analysis" active={location.pathname === '/analysis'} />
                  <SidebarItem to="/chat" icon={MessageSquare} label="Health AI" active={location.pathname === '/chat'} />
                  <SidebarItem to="/settings" icon={SettingsIcon} label="Settings" active={location.pathname === '/settings'} />
                </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <AnimatePresence mode='wait'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
