import { useState } from 'react';
import { User, MapPin, Calendar } from 'lucide-react';
import SectionLayout, { CommentsSection, ShowOnMapButton } from '../components/ui/SectionLayout';
import type { BiographyPeriod } from '../types';

const periods: BiographyPeriod[] = [
  {
    id: 'childhood',
    title: 'Детство в Куштошуре',
    years: '1955 – 1972',
    location: 'д. Куштошур, Удмуртия',
    description:
      'Эрик Батуев родился в небольшой удмуртской деревне Куштошур. С детства он был окружён народными песнями, сказаниями и традициями удмуртского народа, которые впоследствии нашли отражение в его творчестве. Первые стихи он начал писать ещё в начальной школе.',
    mapPointId: 'biography',
  },
  {
    id: 'school',
    title: 'Учёба в Можге',
    years: '1972 – 1977',
    location: 'г. Можга, Удмуртия',
    description:
      'После окончания сельской школы Эрик поступил в Можгинское педагогическое училище. Именно здесь он начал серьёзно заниматься литературным творчеством, публиковать стихи в местных изданиях и участвовать в литературных объединениях.',
  },
  {
    id: 'mgu',
    title: 'Москва, МГУ',
    years: '1977 – 1982',
    location: 'Москва, МГУ им. Ломоносова',
    description:
      'Поступление на факультет журналистики МГУ открыло новую страницу в жизни Батуева. Столичная литературная среда, общение с известными писателями, широкий культурный кругозор — всё это обогатило его творческий мир. Параллельно он продолжал писать стихи на удмуртском языке.',
  },
  {
    id: 'return',
    title: 'Возвращение в Удмуртию',
    years: '1982 – 1994',
    location: 'Ижевск, Удмуртия',
    description:
      'После окончания МГУ Батуев вернулся в Удмуртию и посвятил себя журналистике и литературе. Он работал в редакциях нескольких изданий, издал несколько сборников стихов, активно участвовал в культурной жизни республики.',
  },
  {
    id: 'chechnya',
    title: 'Чечня, военные командировки',
    years: '1994 – 2000',
    location: 'Чечня, Северный Кавказ',
    description:
      'В 1994 году Батуев отправился в Чечню как военный корреспондент. Его репортажи с мест боёв отличались честностью и гуманизмом. Этот период оставил глубокий след в его творчестве — появился целый цикл стихов о войне и человеческой судьбе.',
  },
  {
    id: 'late',
    title: 'Поздний период',
    years: '2000 – наши дни',
    location: 'Ижевск, Удмуртия',
    description:
      'В последние годы Батуев сосредоточился на литературном творчестве, переводах и общественной деятельности. Он стал одним из ключевых популяризаторов удмуртской литературы и культуры в России и за рубежом.',
  },
];

export default function BiographyPage() {
  const [activePeriod, setActivePeriod] = useState<string>(periods[0].id);

  const currentPeriod = periods.find((p) => p.id === activePeriod) ?? periods[0];

  return (
    <SectionLayout
      title="Биография"
      subtitle="Жизненный путь Эрика Батуева"
      icon={<User size={20} />}
      sidebar={<BiographySidebar periods={periods} active={activePeriod} onSelect={setActivePeriod} />}
    >
      {/* Основное содержание периода */}
      <div className="animate-float-up">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Calendar size={14} className="text-blue-400" />
            {currentPeriod.years}
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={14} className="text-blue-400" />
            {currentPeriod.location}
          </span>
          <ShowOnMapButton />
        </div>

        <h2 className="text-2xl font-serif font-bold text-blue-900 mb-4">{currentPeriod.title}</h2>

        {/* Заглушка изображения */}
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl mb-6 flex items-center justify-center border border-blue-100">
          <p className="text-slate-300 text-sm">Фотография периода (будет добавлена)</p>
        </div>

        {/* Текст */}
        <div className="max-w-2xl">
          <p className="text-slate-600 leading-relaxed text-base">{currentPeriod.description}</p>
        </div>

        {/* Навигация по периодам */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-blue-100">
          {periods.findIndex((p) => p.id === activePeriod) > 0 && (
            <button
              onClick={() => {
                const idx = periods.findIndex((p) => p.id === activePeriod);
                setActivePeriod(periods[idx - 1].id);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← {periods[periods.findIndex((p) => p.id === activePeriod) - 1].title}
            </button>
          )}
          {periods.findIndex((p) => p.id === activePeriod) < periods.length - 1 && (
            <button
              onClick={() => {
                const idx = periods.findIndex((p) => p.id === activePeriod);
                setActivePeriod(periods[idx + 1].id);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-auto"
            >
              {periods[periods.findIndex((p) => p.id === activePeriod) + 1].title} →
            </button>
          )}
        </div>

        <CommentsSection articleId={1} />
      </div>
    </SectionLayout>
  );
}

function BiographySidebar({
  periods,
  active,
  onSelect,
}: {
  periods: BiographyPeriod[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
        Периоды жизни
      </h3>
      <nav className="space-y-1">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelect(period.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
              active === period.id
                ? 'bg-blue-700 text-white'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <div className="text-sm font-medium">{period.title}</div>
            <div className={`text-xs mt-0.5 ${active === period.id ? 'text-blue-200' : 'text-slate-400'}`}>
              {period.years}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
