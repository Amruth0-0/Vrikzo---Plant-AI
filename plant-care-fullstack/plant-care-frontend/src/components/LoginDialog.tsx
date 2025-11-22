import { motion } from 'motion/react';
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock,  EyeOff, Mail, Fingerprint, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';   // ✅ FIX: added useEffect import

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Load logged-in email if exists
  useEffect(() => {
    const saved = localStorage.getItem("vrikzo_user_email");
    if (saved) {
      setEmail(saved);
      setLoggedIn(true);
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("vrikzo_user_email");
    setLoggedIn(false);
    alert("You have logged out.");
    onOpenChange(false); // close dialog
  };

  // 🌱 Handles login + stores email for reminders
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter a valid email.');
      return;
    }

    // optional: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/registerEmail', { email });

      // ✅ Save logged-in email
      localStorage.setItem("vrikzo_user_email", email);
      setLoggedIn(true);

      alert('Welcome to VRIKZO Monitoring System! 🌿\nYou’ll now receive care reminders.');
      onOpenChange(false);
    } catch (error) {
      console.error('Error registering email:', error);
      alert('Failed to register email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[60vw] h-[60vh] bg-black border-emerald-500/30 text-white overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Biomechanical Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="login-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ff88" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        {/* Foreground */}
        <div className="relative z-10">
          <DialogHeader>
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 w-20 h-20 rounded-full border-2 border-emerald-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/50">
                  <Fingerprint className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <DialogTitle
              className="text-center text-3xl tracking-wider"
              style={{
                background: 'linear-gradient(90deg, #00ff88, #00e6ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.2em',
              }}
            >
              ACCESS PORTAL
            </DialogTitle>

            <DialogDescription className="text-center text-gray-400 font-mono tracking-wide">
              Enter credentials to access monitoring system
            </DialogDescription>
          </DialogHeader>

          {/* ⬇️ IF LOGGED IN — SHOW LOGOUT UI */}
          {loggedIn ? (
            <div className="mt-10 flex flex-col items-center gap-6">
              <p className="text-center text-emerald-400 font-mono">
                Logged in as <span className="text-cyan-400">{email}</span>
              </p>

              <motion.button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600/30 border border-red-500/40 text-red-300 rounded-lg hover:bg-red-600/40 transition-all font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                LOG OUT
              </motion.button>
            </div>
          ) : (
            // ⬇️ NORMAL LOGIN FORM (fixed JSX comment error)
            <form onSubmit={handleLogin} className="mt-8 space-y-6">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-mono tracking-wide">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@vrikzo.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-white/5 border-emerald-500/30 text-white placeholder:text-gray-600 focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-mono tracking-wide">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-white/5 border-cyan-500/30 text-white placeholder:text-gray-600 focus:border-cyan-500 font-mono"
                    required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                     {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white transition" />
                     ) : (
                        <Eye className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300 transition" />
                     )}
                    </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-mono tracking-widest relative overflow-hidden group disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative">{loading ? 'CONNECTING...' : 'INITIATE ACCESS'}</span>
              </motion.button>
            </form>
          )}

          {/* Status Indicator */}
          {loggedIn && (
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600 font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>SECURE CONNECTION ESTABLISHED</span>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
 }
