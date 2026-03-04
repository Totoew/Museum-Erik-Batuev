import { Link } from 'react-router-dom';
import { MapPin, Mail, BookOpen } from 'lucide-react';

const footerLinks = [
  { label: 'Биография', path: '/biography' },
  { label: 'Творчество', path: '/works' },
  { label: 'Журналистика', path: '/journalism' },
  { label: 'Архивы', path: '/archives' },
  { label: 'Исследования', path: '/research' },
  { label: 'Интерактив', path: '/interactive' },
  { label: 'Образование', path: '/education' },
];

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100 mt-auto">
      {/* Удмуртский орнамент-разделитель */}
      <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Логотип и описание */}
          <div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-white font-serif">Эрик Батуев</span>
              <div className="mt-1 h-0.5 w-16 bg-blue-400 opacity-60" />
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Виртуальный музей-лаборатория, посвящённый удмуртскому поэту, журналисту
              и общественному деятелю Эрику Батуеву.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-300">
              <MapPin size={14} />
              <span>Удмуртия, Россия</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-blue-300">
              <Mail size={14} />
              <span>museum@erik-batuev.ru</span>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Разделы музея
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Проект */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              О проекте
            </h4>
            <p className="text-sm text-blue-200 leading-relaxed mb-4">
              Проект реализован при поддержке МБОУ «Каменская СОШ» в рамках
              Проектного практикума.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <BookOpen size={14} />
              <span>Источники и научная база</span>
            </div>
            <div className="mt-4">
              <Link
                to="/education"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                Образовательная часть
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-400">
            © 2026 Виртуальный музей Эрика Батуева. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-blue-400 hover:text-blue-200 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/sources" className="text-xs text-blue-400 hover:text-blue-200 transition-colors">
              Источники
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
