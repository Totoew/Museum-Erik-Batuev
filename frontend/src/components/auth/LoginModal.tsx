import { useState } from 'react';
import { X, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type ModalTab = 'login' | 'register';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, register } = useAuth();
  const [tab, setTab] = useState<ModalTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, inviteCode || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Оверлей */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeLoginModal}
      />

      {/* Модальное окно */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                Виртуальный музей Эрика Батуева
              </p>
              <h2 className="text-white text-xl font-serif font-bold mt-1">
                {tab === 'login' ? 'Вход в кабинет' : 'Регистрация'}
              </h2>
            </div>
            <button
              onClick={closeLoginModal}
              className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Табы */}
          <div className="flex mt-4 gap-1 bg-blue-900/40 rounded-lg p-1">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'login' ? 'bg-white text-blue-800' : 'text-blue-200 hover:text-white'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'register' ? 'bg-white text-blue-800' : 'text-blue-200 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>
        </div>

        {/* Форма */}
        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Имя и фамилия
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Иван Иванов"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@school.ru"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Пригласительный код{' '}
                  <span className="text-slate-400 font-normal">(необязательно)</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Код от учителя"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Если у вас есть пригласительный код от учителя, введите его здесь
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {loading ? 'Подождите...' : tab === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          {tab === 'login' && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Нет аккаунта?{' '}
              <button
                onClick={() => setTab('register')}
                className="text-blue-600 hover:underline"
              >
                Зарегистрируйтесь
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
