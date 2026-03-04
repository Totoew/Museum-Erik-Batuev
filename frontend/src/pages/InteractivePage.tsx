import { useState } from 'react';
import { Gamepad2, BookMarked, Upload, Send } from 'lucide-react';
import SectionLayout from '../components/ui/SectionLayout';
import { useAuth } from '../context/AuthContext';

const mockRoutes = [
  {
    id: 1,
    title: 'Детство в Куштошуре',
    description: 'Истоки творчества: деревенское детство, первые стихи, народные традиции.',
    duration: '35 мин',
    articles: 5,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Москва и большая литература',
    description: 'МГУ, столичная литературная среда, первые публикации.',
    duration: '25 мин',
    articles: 4,
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    id: 3,
    title: 'Война и мир: Чечня',
    description: 'Репортажи из зоны конфликта, военная лирика, цена правды.',
    duration: '45 мин',
    articles: 7,
    color: 'from-slate-500 to-slate-700',
  },
];

const timelineEvents = [
  { year: '1955', event: 'Рождение в деревне Куштошур', type: 'life' },
  { year: '1972', event: 'Поступление в Можгинское педагогическое училище', type: 'education' },
  { year: '1977', event: 'МГУ, факультет журналистики', type: 'education' },
  { year: '1982', event: 'Первый сборник стихов', type: 'creative' },
  { year: '1988', event: 'Главный редактор журнала «Молот»', type: 'career' },
  { year: '1994', event: 'Командировка в Чечню', type: 'life' },
  { year: '1998', event: 'Государственная премия Удмуртии', type: 'achievement' },
  { year: '2005', event: 'Третий сборник стихов "Дорога домой"', type: 'creative' },
];

const eventColors: Record<string, string> = {
  life: 'bg-blue-500',
  education: 'bg-indigo-500',
  creative: 'bg-violet-500',
  career: 'bg-sky-500',
  achievement: 'bg-amber-500',
};

export default function InteractivePage() {
  const { user, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'routes' | 'memories'>('timeline');
  const [memoryText, setMemoryText] = useState('');

  return (
    <SectionLayout
      title="Интерактив"
      subtitle="Лента жизни, маршруты читателя, народные воспоминания"
      icon={<Gamepad2 size={20} />}
    >
      {/* Табы */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit">
        {[
          { id: 'timeline' as const, label: 'Лента жизни' },
          { id: 'routes' as const, label: 'Маршруты читателя' },
          { id: 'memories' as const, label: 'Народные воспоминания' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Лента жизни */}
      {activeTab === 'timeline' && (
        <div className="relative">
          {/* Вертикальная линия */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200" />

          <div className="space-y-6">
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex gap-6 pl-4 animate-float-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Точка */}
                <div className={`relative flex-shrink-0 w-5 h-5 rounded-full ${eventColors[event.type]} border-2 border-white shadow-md mt-1`} />

                {/* Контент */}
                <div className="flex-1 bg-white rounded-xl border border-blue-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <span className="text-blue-600 font-bold text-sm font-serif">{event.year}</span>
                  <p className="text-slate-700 text-sm mt-1">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Маршруты читателя */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
              <div className={`bg-gradient-to-br ${route.color} p-6 text-white`}>
                <BookMarked size={24} className="mb-3 opacity-80" />
                <h3 className="font-serif font-bold text-lg">{route.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{route.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>{route.articles} материалов</span>
                  <span>·</span>
                  <span>{route.duration}</span>
                </div>
                <button className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl transition-colors">
                  Пройти маршрут
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Народные воспоминания */}
      {activeTab === 'memories' && (
        <div className="max-w-2xl">
          <p className="text-slate-500 mb-6 leading-relaxed">
            Поделитесь своими воспоминаниями об Эрике Батуеве — личными историями,
            фотографиями или документами. Ваш вклад поможет сохранить живую память о поэте.
          </p>

          {user ? (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Поделиться воспоминанием</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ваше воспоминание</label>
                  <textarea
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    rows={5}
                    placeholder="Расскажите о своей встрече с Эриком Батуевым, о его стихах или личности..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Прикрепить файлы{' '}
                    <span className="text-slate-400 font-normal">(фото, документы)</span>
                  </label>
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload size={24} className="mx-auto mb-2 text-blue-300" />
                    <p className="text-sm text-slate-400">Перетащите файлы или нажмите для выбора</p>
                    <p className="text-xs text-slate-300 mt-1">JPG, PNG, PDF до 10 МБ</p>
                  </div>
                </div>

                <button
                  disabled={!memoryText.trim()}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  <Send size={16} />
                  Отправить воспоминание
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 text-center">
              <p className="text-slate-500 mb-4">
                Для отправки воспоминаний необходима авторизация
              </p>
              <button
                onClick={openLoginModal}
                className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors"
              >
                Войти
              </button>
            </div>
          )}
        </div>
      )}
    </SectionLayout>
  );
}
