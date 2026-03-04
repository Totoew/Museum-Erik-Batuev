import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  const roleLabel: Record<string, string> = {
    admin: 'Администратор',
    student: 'Ученик',
    guest: 'Гость',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Шапка */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <a href="/" className="hover:text-blue-600">Главная</a>
            <span>/</span>
            <span className="text-slate-600">Личный кабинет</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-2xl font-bold font-serif">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-blue-900">{user.name}</h1>
              <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">
                {roleLabel[role] ?? role}
              </span>
            </div>
          </div>
          <div className="mt-6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Информация об аккаунте */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-5 flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            Данные аккаунта
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 w-32">Имя</span>
              <span className="text-slate-800 font-medium">{user.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 w-32">Email</span>
              <span className="text-slate-800 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 w-32">Роль</span>
              <span className="text-slate-800 font-medium">{roleLabel[role] ?? role}</span>
            </div>
            {user.class_name && (
              <div className="flex items-center gap-3 text-sm">
                <Settings size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 w-32">Класс</span>
                <span className="text-slate-800 font-medium">{user.class_name}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-500 w-32">Дата регистрации</span>
              <span className="text-slate-800 font-medium">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Быстрые ссылки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {role === 'admin' && (
            <Link
              to="/admin"
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div>
                <div className="font-semibold">Панель администратора</div>
                <div className="text-blue-200 text-sm mt-0.5">Управление контентом сайта</div>
              </div>
            </Link>
          )}

          <Link
            to="/education"
            className="bg-white hover:bg-blue-50 border border-blue-100 text-slate-700 rounded-2xl p-5 flex items-center gap-4 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <span className="text-lg">📚</span>
            </div>
            <div>
              <div className="font-semibold text-blue-900">Образование</div>
              <div className="text-slate-400 text-sm mt-0.5">Тесты и задания</div>
            </div>
          </Link>

          <Link
            to="/interactive"
            className="bg-white hover:bg-blue-50 border border-blue-100 text-slate-700 rounded-2xl p-5 flex items-center gap-4 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <span className="text-lg">🗺️</span>
            </div>
            <div>
              <div className="font-semibold text-blue-900">Интерактив</div>
              <div className="text-slate-400 text-sm mt-0.5">Лента жизни и маршруты</div>
            </div>
          </Link>
        </div>

        {/* Выход */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-3">Выход из аккаунта</h2>
          <p className="text-sm text-slate-400 mb-4">После выхода потребуется повторная авторизация.</p>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
