import { useState, useEffect } from 'react';
import { Menu, X, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ModuleIcon from './ModuleIcon';
import { useContent } from '../hooks/useContent';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { site } = useContent();
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/deck', label: '牌组图鉴' },
    { href: '/divine', label: '占卜抽牌' },
    { href: '/history', label: '历史记录' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0d0518]/90 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <ModuleIcon name="nav.logo" fallback={Moon} size={24} className="text-[#d4af37] group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-serif font-semibold text-[#e8e3f3] tracking-wide">
              {site.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#d4af37]'
                    : 'text-[#e8e3f3]/70 hover:text-[#d4af37]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-[#e8e3f3] p-2"
            onClick={() => setOpen(!open)}
            aria-label="菜单"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0d0518]/95 backdrop-blur-md border-t border-[#d4af37]/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.href ? 'text-[#d4af37]' : 'text-[#e8e3f3]/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
