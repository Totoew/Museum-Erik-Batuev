import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import HomePage from './pages/HomePage';
import BiographyPage from './pages/BiographyPage';
import WorksPage from './pages/WorksPage';
import JournalismPage from './pages/JournalismPage';
import ArchivesPage from './pages/ArchivesPage';
import ResearchPage from './pages/ResearchPage';
import InteractivePage from './pages/InteractivePage';
import EducationPage from './pages/EducationPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Удмуртский орнамент под навбаром */}
      <div className="w-full h-16 flex-shrink-0" style={{ backgroundImage: 'url(/ornament.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%' }} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/biography" element={<BiographyPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/works/:sub" element={<WorksPage />} />
          <Route path="/journalism" element={<JournalismPage />} />
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/interactive" element={<InteractivePage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* Удмуртский орнамент над футером */}
      <div className="w-full h-16 flex-shrink-0" style={{ backgroundImage: 'url(/ornament.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%' }} />
      <Footer />
      <LoginModal />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-serif font-bold text-blue-900 mb-4">404</h1>
        <p className="text-slate-500 mb-6">Страница не найдена</p>
        <a href="/" className="px-6 py-2.5 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors">
          На главную
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
