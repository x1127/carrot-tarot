import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 如果已经登录，直接跳转
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const success = login(password);
    if (success) {
      navigate('/admin');
    } else {
      setError('密码错误，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-amber-900/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 mb-4 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient">塔罗牌管理员</h1>
          <p className="text-purple-300/70 mt-2">后台管理系统</p>
        </div>

        {/* 登录表单 */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                管理员密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="请输入管理员密码"
                  className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-fade-in-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <p className="text-xs text-purple-400/50 text-center">
              默认密码：admin123（登录后可修改）
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-3 w-full text-sm text-purple-300/60 hover:text-amber-400 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
