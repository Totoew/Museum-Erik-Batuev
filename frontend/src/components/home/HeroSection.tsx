import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToMap = () => {
    document.getElementById('interactive-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Фоновое изображение карты Удмуртии (SVG-стилизация) */}
      <div className="absolute inset-0 pointer-events-none">
        <UdmurtiaMapBackground />
      </div>

      {/* Удмуртский орнамент — верхняя полоса */}
      <div className="absolute top-0 left-0 right-0">
        <OrnamantBorder />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Текстовая часть */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Виртуальный музей-лаборатория
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-blue-900 leading-tight mb-6">
              Эрик
              <br />
              <span className="text-blue-600">Батуев</span>
            </h1>

            {/* Эпиграф */}
            <blockquote className="relative mb-8">
              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-blue-300" />
              <p className="pl-4 text-lg text-slate-600 italic font-serif leading-relaxed">
                «Я пишу, чтобы земля удмуртская
                <br />
                не забыла своих сыновей...»
              </p>
              <footer className="pl-4 mt-2 text-sm text-blue-400 not-italic">— Эрик Батуев</footer>
            </blockquote>

            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-lg">
              Откройте для себя жизнь и творчество удмуртского поэта, журналиста
              и общественного деятеля. Биография, стихи, архивы, интерактивная
              карта маршрутов.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToMap}
                className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Начать путешествие
                <ArrowDown size={18} />
              </button>
              <a
                href="/biography"
                className="px-6 py-3 border-2 border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 font-medium rounded-xl transition-all"
              >
                Биография
              </a>
            </div>

            {/* Краткая статистика */}
            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { value: '200+', label: 'стихотворений' },
                { value: '15', label: 'лет журналистики' },
                { value: '3', label: 'книги стихов' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-blue-800 font-serif">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Портрет */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Декоративные круги */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 -rotate-3 opacity-60" />
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-200 to-transparent rotate-1 opacity-40" />

              {/* Заглушка для портрета */}
              <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem] rounded-3xl overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 flex items-end justify-center border-4 border-white shadow-2xl">
                {/* Силуэт */}
                <svg viewBox="0 0 200 300" className="w-3/4 h-3/4 text-blue-300" fill="currentColor">
                  <ellipse cx="100" cy="80" rx="45" ry="50" />
                  <path d="M30 300 Q100 200 170 300" />
                </svg>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-blue-500 text-sm font-medium">Портрет Эрика Батуева</p>
                  <p className="text-blue-400 text-xs">Фото будет добавлено</p>
                </div>
              </div>

              {/* Декоративный орнамент */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20">
                <OrnamantCorner />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижний индикатор скролла */}
      <button
        onClick={scrollToMap}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-300 hover:text-blue-500 transition-colors animate-bounce"
      >
        <span className="text-xs font-medium">Прокрутите вниз</span>
        <ArrowDown size={20} />
      </button>
    </section>
  );
}

/* SVG-фон — стилизованная карта Удмуртии */
function UdmurtiaMapBackground() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Упрощённый силуэт Удмуртии */}
      <path
        d="M250,80 L300,60 L380,70 L420,90 L460,80 L500,100 L520,140 L510,180 L530,220 L520,270 L480,300 L460,340 L440,380 L400,400 L380,440 L350,460 L320,440 L290,420 L270,380 L250,340 L230,300 L220,260 L230,220 L210,180 L220,140 L240,110 Z"
        fill="#1e3a8a"
        stroke="#1e3a8a"
        strokeWidth="2"
      />
      {/* Реки */}
      <path d="M300,100 Q320,150 310,200 Q300,250 320,300" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M380,120 Q370,160 360,200 Q350,240 360,280" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Координатная сетка */}
      <line x1="0" y1="150" x2="800" y2="150" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
      <line x1="0" y1="300" x2="800" y2="300" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
      <line x1="200" y1="0" x2="200" y2="600" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
      <line x1="400" y1="0" x2="400" y2="600" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
      <line x1="600" y1="0" x2="600" y2="600" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="5,10" />
    </svg>
  );
}

/* Орнаментальная граница */
function OrnamantBorder() {
  return (
    <div className="flex overflow-hidden h-2">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className={`flex-shrink-0 h-full ${i % 3 === 0 ? 'w-8 bg-blue-800' : i % 3 === 1 ? 'w-4 bg-blue-400' : 'w-2 bg-blue-200'} opacity-30`}
        />
      ))}
    </div>
  );
}

/* Угловой орнамент */
function OrnamantCorner() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full text-blue-600" fill="currentColor">
      <rect x="0" y="0" width="10" height="10" />
      <rect x="15" y="0" width="10" height="10" />
      <rect x="0" y="15" width="10" height="10" />
      <rect x="30" y="0" width="10" height="10" />
      <rect x="0" y="30" width="10" height="10" />
      <rect x="15" y="15" width="10" height="10" />
    </svg>
  );
}
