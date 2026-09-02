import { useEffect, useRef, useState } from 'react';
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
  FileText,
  Columns2,
  Maximize2,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Home,
  BookOpen,
  History as HistoryIcon,
  ExternalLink,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useAdminConfigStore } from '../../store/adminConfig';
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

const previewTabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/deck', label: '图鉴', icon: BookOpen },
  { path: '/divine', label: '占卜', icon: Sparkles },
  { path: '/history', label: '历史', icon: HistoryIcon },
];

type Device = 'desktop' | 'tablet' | 'mobile';

const deviceWidth: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // 移动端导航抽屉
  const [splitMode, setSplitMode] = useState(true);       // 分屏预览模式（默认开启）
  const [previewPath, setPreviewPath] = useState('/');    // 预览的前台页面
  const [device, setDevice] = useState<Device>('desktop');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit'); // 移动端：编辑/预览
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reloadTimer = useRef<number | undefined>(undefined);

  // 配置变化 → 自动刷新前台预览（防抖，避免连续输入时频繁 reload）
  useEffect(() => {
    const unsubscribe = useAdminConfigStore.subscribe(() => {
      window.clearTimeout(reloadTimer.current);
      reloadTimer.current = window.setTimeout(() => {
        try {
          iframeRef.current?.contentWindow?.location.reload();
        } catch {
          /* 跨域或未加载时忽略 */
        }
      }, 700);
    });
    return () => {
      window.clearTimeout(reloadTimer.current);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const refreshPreview = () => {
    try {
      iframeRef.current?.contentWindow?.location.reload();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-purple-950/50 via-[#0d0518] to-amber-950/30">
      {/* 移动端导航遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边导航栏：分屏时桌面端收窄为图标栏 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 flex-shrink-0
          bg-purple-950/80 backdrop-blur-xl border-r border-purple-500/20
          transform lg:transform-none transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72 ${splitMode ? 'lg:w-16' : 'lg:w-72'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo 区域 */}
          <div className="p-4 lg:p-3 border-b border-purple-500/20 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${splitMode ? 'lg:justify-center lg:w-full' : ''}`}>
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
                <ModuleIcon name="admin.logo" fallback={Sparkles} size={20} className="text-white" />
              </div>
              <div className={splitMode ? 'lg:hidden' : ''}>
                <h1 className="font-bold text-white whitespace-nowrap">管理后台</h1>
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

          {/* 导航菜单 */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                title={splitMode ? item.label : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-xl transition-all
                  ${splitMode ? 'lg:justify-center lg:px-0 px-4 py-3' : 'px-4 py-3'}
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-amber-500/20 text-white border border-purple-500/30'
                    : 'text-purple-300/70 hover:text-white hover:bg-purple-500/10'
                  }
                `}
              >
                <ModuleIcon name={item.iconKey} fallback={item.icon} size={20} className="flex-shrink-0" />
                <div className={`flex-1 min-w-0 ${splitMode ? 'lg:hidden' : ''}`}>
                  <div className="font-medium whitespace-nowrap">{item.label}</div>
                  <div className="text-xs opacity-70 truncate">{item.description}</div>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-50 ${splitMode ? 'lg:hidden' : ''}`} />
              </NavLink>
            ))}
          </nav>

          {/* 底部操作 */}
          <div className="p-3 border-t border-purple-500/20 space-y-1">
            <button
              onClick={() => navigate('/')}
              title="返回前台"
              className={`w-full flex items-center gap-3 py-3 rounded-xl text-purple-300/70 hover:text-white hover:bg-purple-500/10 transition-all ${splitMode ? 'lg:justify-center lg:px-0 px-4' : 'px-4'}`}
            >
              <ChevronRight className="w-5 h-5 rotate-180 flex-shrink-0" />
              <span className={splitMode ? 'lg:hidden' : ''}>返回前台</span>
            </button>
            <button
              onClick={handleLogout}
              title="退出登录"
              className={`w-full flex items-center gap-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${splitMode ? 'lg:justify-center lg:px-0 px-4' : 'px-4'}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={splitMode ? 'lg:hidden' : ''}>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 编辑面板 */}
      <section
        className={`flex-1 min-w-0 flex flex-col
          ${splitMode && mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}
      >
        {/* 顶栏 */}
        <header className="z-20 flex-shrink-0 bg-purple-950/50 backdrop-blur-xl border-b border-purple-500/20">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-purple-300 hover:text-white flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* 移动端：切换到预览 */}
              {splitMode && (
                <button
                  onClick={() => setMobileView('preview')}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 text-purple-100 text-sm border border-purple-500/30 flex-shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  预览
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* 分屏 / 全屏切换（桌面端） */}
              {splitMode ? (
                <button
                  onClick={() => setSplitMode(false)}
                  title="退出分屏，全屏编辑"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/10 text-sm transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                  全屏编辑
                </button>
              ) : (
                <button
                  onClick={() => setSplitMode(true)}
                  title="分屏预览前台"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-amber-500/30 text-white text-sm border border-purple-500/30 hover:from-purple-600/60 transition-all"
                >
                  <Columns2 className="w-4 h-4" />
                  <span className="hidden sm:inline">分屏预览</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-purple-500/20">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
                  <ModuleIcon name="admin.logo" fallback={Sparkles} size={14} className="text-white" />
                </div>
                <span className="text-purple-200 text-sm">管理员</span>
              </div>
            </div>
          </div>
        </header>

        {/* 设置内容 */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className={splitMode ? '' : 'max-w-5xl mx-auto'}>
            <Outlet />
          </div>
        </main>
      </section>

      {/* 前台实时预览面板 */}
      {splitMode && (
        <section
          className={`flex-1 min-w-0 flex flex-col border-l border-purple-500/20 bg-black/40
            ${mobileView === 'edit' ? 'hidden lg:flex' : 'flex'}`}
        >
          {/* 预览工具栏 */}
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b border-purple-500/20 bg-purple-950/60 backdrop-blur-xl">
            {/* 移动端返回编辑 */}
            <button
              onClick={() => setMobileView('edit')}
              className="lg:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-500/10 text-sm flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              编辑
            </button>

            {/* 前台页面切换 */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto">
              {previewTabs.map((tab) => {
                const Icon = tab.icon;
                const active = previewPath === tab.path;
                return (
                  <button
                    key={tab.path}
                    onClick={() => setPreviewPath(tab.path)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0
                      ${active
                        ? 'bg-gradient-to-r from-purple-600/40 to-amber-500/30 text-white border border-purple-500/30'
                        : 'text-purple-300/70 hover:text-white hover:bg-purple-500/10'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 视口尺寸切换 */}
            <div className="hidden sm:flex items-center gap-0.5 px-1 rounded-lg bg-purple-900/40 border border-purple-500/20 flex-shrink-0">
              {([
                ['desktop', Monitor],
                ['tablet', Tablet],
                ['mobile', Smartphone],
              ] as const).map(([key, Icon]) => (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  title={`${key === 'desktop' ? '桌面' : key === 'tablet' ? '平板' : '手机'}视口`}
                  className={`p-1.5 rounded-md transition-all ${
                    device === key ? 'text-amber-300 bg-purple-600/40' : 'text-purple-300/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* 刷新 */}
            <button
              onClick={refreshPreview}
              title="手动刷新预览"
              className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-500/10 transition-all flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* 新窗口打开 */}
            <a
              href={previewPath}
              target="_blank"
              rel="noreferrer"
              title="在新标签页打开前台"
              className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-500/10 transition-all flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* iframe 预览区 */}
          <div className="flex-1 overflow-auto bg-[#0d0518] flex justify-center">
            <div
              style={{ width: deviceWidth[device] }}
              className={`h-full transition-all duration-300 ${
                device === 'desktop' ? '' : 'my-4 shadow-2xl shadow-purple-900/50 rounded-lg overflow-hidden border border-purple-500/20'
              }`}
            >
              <iframe
                ref={iframeRef}
                key={previewPath}
                src={previewPath}
                title="前台实时预览"
                className="w-full h-full border-0 bg-[#0d0518]"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
