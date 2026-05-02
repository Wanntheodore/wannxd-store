import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ShoppingBag, Settings, LogOut, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, logout } = useStore();

  const navLinks = [
    { path: '/', label: 'Home', icon: Zap },
    { path: '/products', label: 'Store', icon: ShoppingBag },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl gradient-text hidden sm:block">
                WannXd X LangszXd
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(path)
                      ? 'bg-primary/20 text-primary neon-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              
              {isAdmin ? (
                <div className="flex items-center gap-1 ml-4">
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-primary/20 text-primary neon-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 ml-4"
                >
                  <User className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive(path)
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
                
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <Settings className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <User className="w-5 h-5" />
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
