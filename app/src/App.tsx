import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Landing Page Sections
import Hero from './sections/Hero';
import PainPoints from './sections/PainPoints';
import Solution from './sections/Solution';
import ProductIntel from './sections/ProductIntel';
import ScriptBuilder from './sections/ScriptBuilder';
import VideoGenerator from './sections/VideoGenerator';
import Testimonials from './sections/Testimonials';
import Pricing from './sections/Pricing';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

// Dashboard Components
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import AuthModal from './components/AuthModal';
import DashboardLayout from './components/DashboardLayout';

// Dashboard Views
import Dashboard from './views/Dashboard';
import Products from './views/Products';
import Scripts from './views/Scripts';
import Videos from './views/Videos';
import Trending from './views/Trending';
import ABTesting from './views/ABTesting';
import Templates from './views/Templates';
import Marketplace from './views/Marketplace';
import Analytics from './views/Analytics';
import Settings from './views/Settings';

gsap.registerPlugin(ScrollTrigger);

// Landing Page Component
function LandingPage({ onOpenAuth }: { onOpenAuth: () => void }) {
  useEffect(() => {
    // Refresh ScrollTrigger when landing page mounts
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative bg-[#05050A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Navigation onOpenAuth={onOpenAuth} />

      <main className="relative">
        <Hero onOpenAuth={onOpenAuth} />
        <PainPoints />
        <Solution />
        <ProductIntel />
        <ScriptBuilder />
        <VideoGenerator />
        <Testimonials />
        <Pricing onOpenAuth={onOpenAuth} />
        <CTA onOpenAuth={onOpenAuth} />
        <Footer />
      </main>
    </div>
  );
}

// Dashboard Router Component
function DashboardRouter() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleStartScript = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('scripts');
  };

  const renderView = () => {
    switch (currentView) {
      case 'products':
        return <Products onGenerateScript={handleStartScript} />;
      case 'scripts':
        return (
          <Scripts
            initialProductId={selectedProductId}
            onClearProduct={() => setSelectedProductId(null)}
          />
        );
      case 'videos':
        return <Videos />;
      case 'trending':
        return <Trending />;
      case 'ab-testing':
        return <ABTesting />;
      case 'templates':
        return <Templates />;
      case 'marketplace':
        return <Marketplace />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onViewChange={(view) => {
      setCurrentView(view);
      if (view !== 'scripts') setSelectedProductId(null);
    }}>
      {renderView()}
    </DashboardLayout>
  );
}

// Main App Content
function AppContent() {
  console.log('🔧 AppContent: Component rendering');
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  console.log('🔧 AppContent: Auth state -', { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('⏳ AppContent: Showing loading spinner');
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  console.log('✅ AppContent: Rendering main content');

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111114',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />

      {isAuthenticated ? (
        <DashboardRouter />
      ) : (
        <>
          <LandingPage onOpenAuth={() => setShowAuthModal(true)} />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </>
      )}
    </>
  );
}

// Root App Component
function App() {
  console.log('🎨 App: Component rendering');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

console.log('📦 App.tsx: Module loaded');
export default App;
