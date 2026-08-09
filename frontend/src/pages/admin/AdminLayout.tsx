import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Palette,
  Image as ImageIcon,
  Settings,
  Key,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import ModuleIcon from '../../components/ModuleIcon';

const menuItems = [
  {
    path: '/admin',
    icon: Palette,
    iconKey: 'admin.menu.theme',
    label: '风格设置',
    description: '网页主题与样式',
  },
  {
    path: '/admin/content',
    icon: FileText,
    iconKey: 'admin.menu.content',
    label: '内容设置',
    description: '全站文字与特效',
  },
  {
    path: '/admin/cards',
    icon: ImageIcon,
    iconKey: 'admin.menu.cards',
    label: '牌面管理',
    description: '手绘牌面上传',
  },
  {
    path: '/admin/api',
    icon: Settings,
    iconKey: 'admin.menu.api',
    label: 'API配置',
    description: '接口与模型设置',
  },
  {
    path: '/admin/password',
    icon: Key,
    iconKey: 'admin.menu.password',
    label: '密码设置',
    description: '管理员密码修改',
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-950/50 via-[#0d0518] to-amber-950/30">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside className={`
        fixed lg:fixed inset-y-0 left-0 z-40
        w-72 bg-purple-950/80 backdrop-blur-xl border-r border-purple-500/20
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full">
          {/* Logo区域 */}
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
                  <ModuleIcon name="admin.logo" fallback={Sparkles} size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">管理后台</h1>
                  <p className="text-xs text-purple-300/60">Tarot Admin</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-purple-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600/30 to-amber-500/20 text-white border border-purple-500/30' 
                    : 'text-purple-300/70 hover:text-white hover:bg-purple-500/10'
                  }
                `}
              >
                <ModuleIcon name={item.iconKey} fallback={item.icon} size={20} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70 truncate">{item.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            ))}
          </nav>

          {/* 底部操作 */}
          <div className="p-4 border-t border-purple-500/20 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-300/70 hover:text-white hover:bg-purple-500/10 transition-all"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              返回前台
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="sticky top-0 z-20 bg-purple-950/50 backdrop-blur-xl border-b border-purple-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-purple-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
                <ModuleIcon name="admin.logo" fallback={Sparkles} size={16} className="text-white" />
              </div>
              <span className="text-purple-200 text-sm">管理员</span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
