import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { NavItem } from '../../types';

const navItems: NavItem[] = [
  { label: 'Биография', path: '/biography' },
  {
    label: 'Творчество',
    path: '/works',
    children: [
      { label: 'Поэзия', path: '/works/poetry' },
      { label: 'Проза', path: '/works/prose' },
      { label: 'Переводы', path: '/works/translations' },
    ],
  },
  { label: 'Журналистика', path: '/journalism' },
  { label: 'Архивы', path: '/archives' },
  { label: 'Исследования', path: '/research' },
  { label: 'Интерактив', path: '/interactive' },
  { label: 'Образование', path: '/education' },
];

export default function Navbar() {
  const { user, role, logout, openLoginModal } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const handleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <span className="text-xl font-bold text-blue-900 font-serif tracking-tight">
              Эрик Батуев
            </span>
            {/* Удмуртский орнамент-акцент */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-blue-200 to-transparent" />
          </div>
          <div className="hidden sm:block w-px h-6 bg-blue-200 mx-1" />
          <span className="hidden sm:block text-xs text-blue-500 font-medium">
            Виртуальный музей
          </span>
        </Link>

        {/* Десктопное меню */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.children ? (
                <button
                  onClick={() => handleDropdown(item.label)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              )}

              {/* Выпадающее меню */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-blue-100 py-1 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-2">
          {/* Поиск */}
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-200">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по музею..."
                className="bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 w-40 sm:w-56"
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Поиск"
            >
              <Search size={20} />
            </button>
          )}

          {/* Авторизация */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium">
                <User size={16} />
                <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
              </button>
              {/* Выпадающее меню профиля */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-blue-100 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-blue-50">
                  <p className="text-sm font-medium text-slate-700">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  {role === 'admin' && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Администратор</span>
                  )}
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700">
                  Личный кабинет
                </Link>
                {role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700">
                    Панель администратора
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-4 py-1.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Войти
            </button>
          )}

          {/* Мобильное меню */}
          <button
            className="lg:hidden p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-blue-100 bg-white py-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => handleDropdown(item.label)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {item.label}
                    <ChevronDown size={14} className={activeDropdown === item.label ? 'rotate-180' : ''} />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="bg-blue-50 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-500 hover:text-blue-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Закрытие дропдауна при клике вне */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
      )}
    </header>
  );
}
