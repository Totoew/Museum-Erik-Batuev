import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Newspaper, Archive, FlaskConical, Gamepad2, GraduationCap, User } from 'lucide-react';
import type { MapPoint } from '../../types';

const mapPoints: MapPoint[] = [
  {
    id: 'biography',
    label: 'Биография',
    x: 38,
    y: 25,
    section: 'Биография',
    path: '/biography',
    description: 'Место рождения — д. Куштошур',
    isPrimary: true,
  },
  {
    id: 'works',
    label: 'Творчество',
    x: 55,
    y: 40,
    section: 'Творчество',
    path: '/works',
    description: 'Поэзия, проза и переводы',
  },
  {
    id: 'journalism',
    label: 'Журналистика',
    x: 48,
    y: 58,
    section: 'Журналистика',
    path: '/journalism',
    description: 'Публикации и репортажи',
  },
  {
    id: 'archives',
    label: 'Архивы',
    x: 30,
    y: 55,
    section: 'Архивы',
    path: '/archives',
    description: 'Документы и фотографии',
  },
  {
    id: 'research',
    label: 'Исследования',
    x: 65,
    y: 25,
    section: 'Исследования',
    path: '/research',
    description: 'Научные работы и статьи',
  },
  {
    id: 'interactive',
    label: 'Интерактив',
    x: 70,
    y: 55,
    section: 'Интерактив',
    path: '/interactive',
    description: 'Лента жизни и маршруты',
  },
  {
    id: 'education',
    label: 'Образование',
    x: 45,
    y: 75,
    section: 'Образование',
    path: '/education',
    description: 'Тесты и учебные материалы',
  },
];

const pointIcons: Record<string, React.ElementType> = {
  biography: User,
  works: BookOpen,
  journalism: Newspaper,
  archives: Archive,
  research: FlaskConical,
  interactive: Gamepad2,
  education: GraduationCap,
};

const pointColors: Record<string, string> = {
  biography: 'bg-blue-700 border-blue-300 text-white',
  works: 'bg-blue-600 border-blue-200 text-white',
  journalism: 'bg-blue-500 border-blue-100 text-white',
  archives: 'bg-indigo-600 border-indigo-200 text-white',
  research: 'bg-sky-600 border-sky-200 text-white',
  interactive: 'bg-blue-800 border-blue-300 text-white',
  education: 'bg-cyan-600 border-cyan-200 text-white',
};

export default function InteractiveMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section id="interactive-map" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Навигация
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-blue-900 mb-4">
            Карта музея
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Нажмите на точку интереса, чтобы перейти в соответствующий раздел музея.
            Каждая точка связана с важным местом или периодом жизни Эрика Батуева.
          </p>
        </div>

        {/* Карта (десктоп) */}
        <div className="hidden md:block relative w-full max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border-2 border-blue-100 shadow-xl bg-gradient-to-br from-blue-50 to-slate-50">
            {/* SVG карта */}
            <svg viewBox="0 0 100 100" className="w-full" style={{ minHeight: 400 }}>
              {/* Фон карты */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#dbeafe" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Силуэт Удмуртии */}
              <path
                d="M28,12 L36,8 L46,10 L52,14 L58,11 L62,16 L64,22 L61,28 L63,35 L60,42 L55,47 L53,54 L49,60 L43,64 L40,70 L36,73 L31,70 L27,65 L24,58 L21,50 L20,42 L22,35 L19,27 L21,20 L25,15 Z"
                fill="#dbeafe"
                stroke="#93c5fd"
                strokeWidth="0.5"
                opacity="0.8"
              />

              {/* Реки */}
              <path d="M35,15 Q38,25 36,35 Q34,45 38,55" stroke="#93c5fd" strokeWidth="0.7" fill="none" opacity="0.6" />
              <path d="M45,18 Q43,28 42,38 Q41,48 44,55" stroke="#93c5fd" strokeWidth="0.5" fill="none" opacity="0.5" />

              {/* Соединительные линии между точками */}
              {mapPoints.map((point, i) =>
                mapPoints.slice(i + 1).map((other) => {
                  const dist = Math.sqrt(
                    Math.pow(point.x - other.x, 2) + Math.pow(point.y - other.y, 2)
                  );
                  if (dist < 30) {
                    return (
                      <line
                        key={`${point.id}-${other.id}`}
                        x1={point.x}
                        y1={point.y}
                        x2={other.x}
                        y2={other.y}
                        stroke="#bfdbfe"
                        strokeWidth="0.4"
                        strokeDasharray="1,2"
                        opacity="0.6"
                      />
                    );
                  }
                  return null;
                })
              )}

              {/* Точки интереса */}
              {mapPoints.map((point) => {
                const isHovered = hovered === point.id;
                const size = point.isPrimary ? 4 : 3;

                return (
                  <g key={point.id}>
                    {/* Пульсирующее кольцо для главной точки */}
                    {point.isPrimary && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={size + 2}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.5"
                        opacity="0.4"
                      >
                        <animate attributeName="r" from={size + 1} to={size + 4} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Тень при наведении */}
                    {isHovered && (
                      <circle cx={point.x} cy={point.y} r={size + 2.5} fill="#1e3a8a" opacity="0.15" />
                    )}

                    {/* Кликабельная точка */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHovered ? size + 0.8 : size}
                      fill={isHovered ? '#1e3a8a' : '#3b82f6'}
                      stroke="white"
                      strokeWidth="0.8"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHovered(point.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(point.path)}
                    />

                    {/* Метка */}
                    <text
                      x={point.x}
                      y={point.y + size + 3}
                      textAnchor="middle"
                      fontSize="3"
                      fill={isHovered ? '#1e3a8a' : '#475569'}
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      className="cursor-pointer select-none"
                      onMouseEnter={() => setHovered(point.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(point.path)}
                    >
                      {point.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Тултип */}
            {hovered && (() => {
              const point = mapPoints.find((p) => p.id === hovered)!;
              return (
                <div
                  className="absolute bg-blue-900 text-white text-sm rounded-xl px-4 py-3 shadow-xl pointer-events-none max-w-xs"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -120%)',
                  }}
                >
                  <p className="font-semibold">{point.label}</p>
                  <p className="text-blue-200 text-xs mt-1">{point.description}</p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-900" />
                </div>
              );
            })()}
          </div>

          {/* Легенда */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {mapPoints.map((point) => {
              const Icon = pointIcons[point.id];
              return (
                <button
                  key={point.id}
                  onClick={() => navigate(point.path)}
                  onMouseEnter={() => setHovered(point.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    hovered === point.id
                      ? pointColors[point.id] + ' shadow-md scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                  } ${point.isPrimary ? 'border-blue-400' : ''}`}
                >
                  <Icon size={12} />
                  {point.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Мобильный список (карточки) */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {mapPoints.map((point) => {
            const Icon = pointIcons[point.id];
            return (
              <button
                key={point.id}
                onClick={() => navigate(point.path)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700">{point.label}</span>
                <span className="text-xs text-slate-400 text-center">{point.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
