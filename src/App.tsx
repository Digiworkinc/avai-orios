/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode, Suspense, lazy } from 'react';
import { 
  Cpu, 
  LayoutDashboard, 
  Globe, 
  Menu, 
  X,
  Smartphone,
  ShieldCheck,
  LogIn,
  LogOut,
  AlertTriangle,
  Download,
  Loader
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from './firebase';
import { cn } from './lib/utils';
import { View, Product, WebsiteContent } from './types';
import { Hero, Solutions, Products, Portfolio, Contact } from './components/Landing';
import { ASSET_CONFIG } from './config/assets';
import { isDevAdminMode, logAdminDebug } from './lib/adminHelper';
import { AdminDebugPanel } from './components/AdminDebugPanel';

// Lazy load AdminDashboard for better code-splitting
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Loading component
const AdminDashboardLoader = () => (
  <div className="min-h-screen bg-brand-dark flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      <p className="text-gray-400 text-sm">Loading Admin Dashboard...</p>
    </div>
  </div>
);

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 text-center">
          <div className="glass-panel p-12 max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8">
              {this.state.error?.message.startsWith('{') 
                ? "A database error occurred. Please check your connection or permissions."
                : "An unexpected error occurred. Please refresh the page."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:scale-105 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Initial Content ---

const INITIAL_CONTENT: WebsiteContent = {
  hero: {
    tagline: "Smart Technology Integrator",
    headline: "Masa Depan \n Intelligent Integration",
    subHeadline: "AVAI-ORIOS menghadirkan ekosistem teknologi yang mulus, terkoneksi, dan efisien. Kami mengintegrasikan AI, IoT, dan solusi visual canggih ke dalam satu sistem intuitif untuk bisnis dan hunian Anda.",
    imageUrl: ASSET_CONFIG.images.heroTech,
    stats: {
      value: "99.9%",
      label: "Uptime Reliability"
    }
  },
  solutions: [
    {
      id: '1',
      title: "Smart Office",
      desc: "Transformasi ruang kerja dengan otomasi pencahayaan, kontrol akses AI, dan sistem konferensi video terintegrasi.",
      icon: 'Building2',
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: '2',
      title: "Smart Classroom",
      desc: "Menciptakan lingkungan belajar interaktif dengan LED interaktif, sistem audio cerdas, dan manajemen kelas berbasis IoT.",
      icon: 'School',
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: '3',
      title: "Smart Home",
      desc: "Kenyamanan dan keamanan maksimal dalam satu genggaman. Kontrol seluruh rumah Anda melalui asisten suara atau smartphone.",
      icon: 'Home',
      color: "from-orange-500/20 to-red-500/20"
    }
  ],
  products: [
    { id: '1', name: 'LED Videotron P1.8', type: 'Indoor', pixelPitch: '1.8mm', brightness: '600-800 nits', status: 'Available' },
    { id: '2', name: 'LED Videotron P2.5', type: 'Indoor', pixelPitch: '2.5mm', brightness: '800-1000 nits', status: 'Available' },
    { id: '3', name: 'LED Videotron P3.9', type: 'Outdoor', pixelPitch: '3.9mm', brightness: '4500-5500 nits', status: 'Low Stock' },
  ],
  portfolio: [
    {
      id: '1',
      title: "Portofolio & Church Projects",
      desc: "Kami bangga telah dipercaya oleh berbagai institusi, termasuk proyek gereja berskala besar. Fokus kami adalah menghadirkan teknologi yang mendukung kekhusyukan dan kejelasan pesan melalui visual dan audio yang presisi.",
      features: [
        "Instalasi LED Videotron P2.5 untuk Altar Utama",
        "Sistem Audio Terintegrasi dengan Akustik Ruang",
        "Live Streaming & Broadcasting Setup",
        "Smart Lighting Control untuk Suasana Ibadah"
      ],
      images: [
        ASSET_CONFIG.images.portfolioAltar,
        ASSET_CONFIG.images.portfolioAudio,
        ASSET_CONFIG.images.portfolioStreaming
      ]
    }
  ],
  contact: {
    title: "Siap Memulai Proyek Anda?",
    subTitle: "Hubungi tim ahli kami untuk konsultasi teknis dan penawaran harga terbaik.",
    team: [
      { id: '1', name: "Joshua", role: "Technical Lead", phone: "+62 812-xxxx-xxxx" },
      { id: '2', name: "Alvin", role: "Sales Manager", phone: "+62 813-xxxx-xxxx" },
      { id: '3', name: "Sugi", role: "IoT Specialist", phone: "+62 815-xxxx-xxxx" }
    ]
  },
  footer: {
    companyName: "AVAI-ORIOS",
    copyright: "© 2026 AVAI-ORIOS. All rights reserved. Smart Technology System Integrator."
  }
};

// --- Sub-components ---

const Navbar = ({ currentView, setView, user, isAdmin, installPrompt, onInstall }: { currentView: View, setView: (v: View) => void, user: FirebaseUser | null, isAdmin: boolean, installPrompt: any, onInstall: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('landing');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-brand-dark/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center glow-primary">
            <Cpu className="text-brand-dark w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter">AVAI<span className="text-brand-primary">-ORIOS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Solutions', 'Products', 'Portfolio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-400 hover:text-brand-primary transition-colors">
              {item}
            </a>
          ))}
          
          {installPrompt && (
            <button 
              onClick={onInstall}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-xs font-bold text-white"
            >
              <Download size={14} /> Install App
            </button>
          )}
          
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button 
                  onClick={() => setView(currentView === 'landing' ? 'admin' : 'landing')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 transition-all text-sm font-semibold text-brand-primary"
                >
                  {currentView === 'landing' ? <LayoutDashboard size={16} /> : <Globe size={16} />}
                  {currentView === 'landing' ? 'Admin Portal' : 'Live Site'}
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                  {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <ShieldCheck size={16} />}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-primary text-brand-dark font-bold hover:scale-105 transition-all text-sm"
            >
              <LogIn size={16} /> Admin Login
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [content, setContent] = useState<WebsiteContent>(INITIAL_CONTENT);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Log admin debug info
        logAdminDebug(u.email, null);
        
        // Check for admin role in Firestore
        const userRef = doc(db, 'users', u.uid);
        
        try {
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setIsAdmin(userSnap.data().role === 'admin');
          } else {
            // Check if it's the hardcoded admin email
            const isHardcodedAdmin = u.email === "eleazaragungnugroho@gmail.com" && u.emailVerified;
            setIsAdmin(isHardcodedAdmin);
            
            // Create user profile if it doesn't exist
            await setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              role: isHardcodedAdmin ? 'admin' : 'user'
            });
          }
        } catch (error) {
          console.error('Firebase error checking admin:', error);
          // Fallback: check if dev admin mode is enabled
          if (isDevAdminMode()) {
            console.log('✅ Using dev admin override');
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Content Sync
  useEffect(() => {
    const contentRef = doc(db, 'content', 'main');
    
    const unsubscribe = onSnapshot(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as WebsiteContent);
      }
      // If it doesn't exist, we just keep using INITIAL_CONTENT from state.
      // We don't auto-initialize here to avoid permission errors for non-admins.
      // The admin can initialize it by clicking "Save Changes" in the dashboard.
    }, (error) => {
      console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen selection:bg-brand-primary selection:text-brand-dark">
        <Navbar currentView={view} setView={setView} user={user} isAdmin={isAdmin} installPrompt={installPrompt} onInstall={handleInstall} />
        
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero content={content.hero} />
              <Solutions solutions={content.solutions} />
              <Products products={content.products} />
              <Portfolio items={content.portfolio} />
              <Contact content={content.contact} />

              <footer className="py-12 border-t border-white/10 bg-brand-surface">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-brand-primary w-6 h-6" />
                    <span className="text-xl font-bold tracking-tighter">{content.footer.companyName}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.footer.copyright}
                  </div>
                  <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors"><Globe size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors"><Smartphone size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-brand-primary transition-colors"><ShieldCheck size={20} /></a>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isAdmin ? (
                <Suspense fallback={<AdminDashboardLoader />}>
                  <AdminDashboard content={content} setContent={setContent} />
                </Suspense>
              ) : (
                <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 text-center">
                  <div className="glass-panel p-12 max-w-md">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
                    <p className="text-gray-400 mb-8">
                      You do not have permission to access the Admin Dashboard. Please contact the administrator if you believe this is an error.
                    </p>
                    <button 
                      onClick={() => setView('landing')}
                      className="px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-full hover:scale-105 transition-all"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <AdminDebugPanel user={user} isAdmin={isAdmin} userEmail={user?.email} />
      </div>
    </ErrorBoundary>
  );
}
