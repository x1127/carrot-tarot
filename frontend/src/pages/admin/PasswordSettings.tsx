import { useState } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Shield,
  Lock
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export default function PasswordSettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState(0);
  
  const changePassword = useAuthStore((state) => state.changePassword);

  // 计算密码强度
  const calculateStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setStrength(calculateStrength(value));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 验证旧密码
    if (!oldPassword) {
      setError('请输入当前密码');
      return;
    }

    // 验证新密码
    if (!newPassword) {
      setError('请输入新密码');
      return;
    }

    if (newPassword.length < 6) {
      setError('新密码至少需要6位字符');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    if (oldPassword === newPassword) {
      setError('新密码不能与旧密码相同');
      return;
    }

    // 修改密码
    const success = changePassword(oldPassword, newPassword);
    if (success) {
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('当前密码错误');
    }
  };

  const getStrengthLabel = (score: number): { label: string; color: string } => {
    if (score <= 1) return { label: '弱', color: 'text-red-400' };
    if (score <= 2) return { label: '一般', color: 'text-orange-400' };
    if (score <= 3) return { label: '强', color: 'text-yellow-400' };
    if (score <= 4) return { label: '很强', color: 'text-green-400' };
    return { label: '极强', color: 'text-emerald-400' };
  };

  const strengthInfo = getStrengthLabel(strength);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Key className="w-6 h-6 text-amber-400" />
          密码设置
        </h1>
        <p className="text-purple-300/70 mt-1">修改管理员登录密码</p>
      </div>

      {/* 安全提示 */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border-yellow-500/30">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-200">
          <p className="font-medium text-yellow-400 mb-1">安全提示</p>
          <p className="text-purple-300/80">
            密码用于保护您的管理后台访问权限，请妥善保管。密码存储在本地浏览器中，清除浏览器数据后将重置为默认密码。
          </p>
        </div>
      </div>

      {/* 修改密码表单 */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
        {/* 当前密码 */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            当前密码
          </label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setError('');
              }}
              placeholder="请输入当前密码"
              className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
            >
              {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 新密码 */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            <Shield className="w-4 h-4 inline mr-2" />
            新密码
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="至少6位字符"
              className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* 密码强度指示 */}
          {newPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">密码强度</span>
                <span className={`text-sm font-medium ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      level <= strength
                        ? strength <= 1
                          ? 'bg-red-400'
                          : strength <= 2
                          ? 'bg-orange-400'
                          : strength <= 3
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                        : 'bg-purple-500/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 确认新密码 */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            确认新密码
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="请再次输入新密码"
              className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-fade-in-up">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2 animate-fade-in-up">
            <CheckCircle className="w-4 h-4" />
            密码修改成功！
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-amber-600 transition-all"
        >
          <Save className="w-5 h-5" />
          修改密码
        </button>
      </form>

      {/* 密码要求 */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-sm text-purple-300/80 mb-3 font-medium">密码建议</p>
        <ul className="space-y-2 text-sm text-purple-400/70">
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-green-400' : 'bg-purple-500/40'}`} />
            至少包含6个字符
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${strength >= 2 ? 'bg-green-400' : 'bg-purple-500/40'}`} />
            建议12位以上字符
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'bg-green-400' : 'bg-purple-500/40'}`} />
            包含大小写字母
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-purple-500/40'}`} />
            包含数字
          </li>
          <li className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-purple-500/40'}`} />
            包含特殊字符
          </li>
        </ul>
      </div>

      {/* 重置说明 */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-sm text-purple-300/80">
          <span className="text-amber-400 font-medium">注意：</span>
          如果忘记密码，清除浏览器数据（localStorage）后，密码将重置为默认密码 <code className="px-2 py-0.5 bg-purple-500/20 rounded text-amber-400">admin123</code>。
        </p>
      </div>
    </div>
  );
}
