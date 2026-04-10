import React, { useState } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Database, 
  Image as ImageIcon, 
  Settings, 
  ShieldCheck, 
  Plus, 
  ChevronRight, 
  Globe, 
  Briefcase, 
  Monitor,
  Save,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle2,
  Users as UsersIcon,
  UserCheck,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { cn } from '../lib/utils';
import { WebsiteContent, Product } from '../types';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AdminDashboardProps {
  content: WebsiteContent;
  setContent: React.Dispatch<React.SetStateAction<WebsiteContent>>;
}

const ANALYTICS_DATA = [
  { name: 'Mon', visitors: 400 },
  { name: 'Tue', visitors: 300 },
  { name: 'Wed', visitors: 200 },
  { name: 'Thu', visitors: 278 },
  { name: 'Fri', visitors: 189 },
  { name: 'Sat', visitors: 239 },
  { name: 'Sun', visitors: 349 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, setContent }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdateRole = async (uid: string, newRole: 'admin' | 'user') => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { role: newRole });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const contentRef = doc(db, 'content', 'main');
      await setDoc(contentRef, content);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.WRITE, 'content/main');
    } finally {
      setIsSaving(false);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
        activeTab === id ? "bg-brand-primary text-brand-dark" : "text-gray-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const handleHeroChange = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-2">
          <div className="mb-8 px-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-lg",
                saveStatus === 'success' ? "bg-green-500 text-white" : 
                saveStatus === 'error' ? "bg-red-500 text-white" :
                "bg-brand-primary text-brand-dark hover:scale-105 active:scale-95 disabled:opacity-50"
              )}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 
               saveStatus === 'success' ? <CheckCircle2 size={18} /> : 
               <Save size={18} />}
              {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
          <SidebarItem id="overview" icon={BarChart3} label="Analytics Overview" />
          <SidebarItem id="hero" icon={Edit2} label="Hero Section" />
          <SidebarItem id="solutions" icon={Briefcase} label="Solutions" />
          <SidebarItem id="products" icon={Database} label="Product CMS" />
          <SidebarItem id="portfolio" icon={ImageIcon} label="Portfolio Manager" />
          <SidebarItem id="contact" icon={MessageSquare} label="Contact Section" />
          <SidebarItem id="users" icon={UsersIcon} label="User Management" />
          <SidebarItem id="footer" icon={Settings} label="Footer & General" />
        </aside>

        <main className="space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Total Visitors", value: "12,482", trend: "+12%", icon: Globe },
                    { label: "Active Projects", value: content.portfolio.length.toString(), trend: "Stable", icon: Briefcase },
                  ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-white/5 text-brand-primary">
                          <stat.icon size={20} />
                        </div>
                        <span className={cn("text-xs font-bold", stat.trend.startsWith('+') ? "text-green-400" : "text-gray-400")}>
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Traffic & Conversion</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ANALYTICS_DATA}>
                        <defs>
                          <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '8px' }}
                          itemStyle={{ color: '#00f2ff' }}
                        />
                        <Area type="monotone" dataKey="visitors" stroke="#00f2ff" fillOpacity={1} fill="url(#colorVis)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'hero' && (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="glass-panel p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Edit2 size={20} className="text-brand-primary" /> Hero Section Editor
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Tagline</label>
                      <input 
                        type="text" 
                        value={content.hero.tagline}
                        onChange={(e) => handleHeroChange('tagline', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Headline</label>
                      <input 
                        type="text" 
                        value={content.hero.headline}
                        onChange={(e) => handleHeroChange('headline', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Sub-Headline</label>
                      <textarea 
                        value={content.hero.subHeadline}
                        onChange={(e) => handleHeroChange('subHeadline', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all h-24" 
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Hero Image URL</label>
                        <input 
                          type="text" 
                          value={content.hero.imageUrl}
                          onChange={(e) => handleHeroChange('imageUrl', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Stat Value</label>
                          <input 
                            type="text" 
                            value={content.hero.stats.value}
                            onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, stats: { ...prev.hero.stats, value: e.target.value } } }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Stat Label</label>
                          <input 
                            type="text" 
                            value={content.hero.stats.label}
                            onChange={(e) => setContent(prev => ({ ...prev, hero: { ...prev.hero, stats: { ...prev.hero.stats, label: e.target.value } } }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'solutions' && (
              <motion.div 
                key="solutions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Solutions Editor</h3>
                  <button 
                    onClick={() => {
                      const newSol = {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'New Solution',
                        desc: 'Description of the new solution...',
                        icon: 'Zap',
                        color: 'from-blue-500/20 to-cyan-500/20'
                      };
                      setContent(prev => ({ ...prev, solutions: [...prev.solutions, newSol] }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-brand-dark font-bold text-sm"
                  >
                    <Plus size={16} /> Add Solution
                  </button>
                </div>
                <div className="grid gap-6">
                  {content.solutions.map((sol, idx) => (
                    <div key={sol.id} className="glass-panel p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Solution #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const newSols = content.solutions.filter(s => s.id !== sol.id);
                            setContent(prev => ({ ...prev, solutions: newSols }));
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                          <input 
                            type="text" 
                            value={sol.title}
                            onChange={(e) => {
                              const newSols = [...content.solutions];
                              newSols[idx].title = e.target.value;
                              setContent(prev => ({ ...prev, solutions: newSols }));
                            }}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Icon Name (Lucide)</label>
                          <input 
                            type="text" 
                            value={sol.icon}
                            onChange={(e) => {
                              const newSols = [...content.solutions];
                              newSols[idx].icon = e.target.value;
                              setContent(prev => ({ ...prev, solutions: newSols }));
                            }}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                          value={sol.desc}
                          onChange={(e) => {
                            const newSols = [...content.solutions];
                            newSols[idx].desc = e.target.value;
                            setContent(prev => ({ ...prev, solutions: newSols }));
                          }}
                          className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none h-20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {content.products.map((p, idx) => (
                  <div key={p.id} className="glass-panel p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-brand-primary">
                        <Monitor size={24} />
                      </div>
                      <button 
                        onClick={() => {
                          const newProds = content.products.filter(item => item.id !== p.id);
                          setContent(prev => ({ ...prev, products: newProds }));
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={p.name}
                        onChange={(e) => {
                          const newProds = [...content.products];
                          newProds[idx].name = e.target.value;
                          setContent(prev => ({ ...prev, products: newProds }));
                        }}
                        className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                        placeholder="Product Name"
                      />
                      <input 
                        type="text" 
                        value={p.imageUrl || ''}
                        onChange={(e) => {
                          const newProds = [...content.products];
                          newProds[idx].imageUrl = e.target.value;
                          setContent(prev => ({ ...prev, products: newProds }));
                        }}
                        className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-xs focus:border-brand-primary outline-none"
                        placeholder="Image URL (Optional)"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={p.pixelPitch}
                          onChange={(e) => {
                            const newProds = [...content.products];
                            newProds[idx].pixelPitch = e.target.value;
                            setContent(prev => ({ ...prev, products: newProds }));
                          }}
                          className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-xs focus:border-brand-primary outline-none"
                          placeholder="Pixel Pitch"
                        />
                        <input 
                          type="text" 
                          value={p.brightness}
                          onChange={(e) => {
                            const newProds = [...content.products];
                            newProds[idx].brightness = e.target.value;
                            setContent(prev => ({ ...prev, products: newProds }));
                          }}
                          className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-xs focus:border-brand-primary outline-none"
                          placeholder="Brightness"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newProd: Product = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: 'New LED Videotron',
                      type: 'Indoor',
                      pixelPitch: 'P2.5',
                      brightness: '800 nits',
                      status: 'Available'
                    };
                    setContent(prev => ({ ...prev, products: [...prev.products, newProd] }));
                  }}
                  className="glass-panel p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary/50 hover:text-brand-primary transition-all min-h-[200px]"
                >
                  <Plus size={32} className="mb-2" />
                  <span className="font-bold">Add New Product</span>
                </button>
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div 
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Portfolio Manager</h3>
                  <button 
                    onClick={() => {
                      const newItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'New Project Title',
                        desc: 'Project description goes here...',
                        features: ['Feature 1', 'Feature 2'],
                        images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80']
                      };
                      setContent(prev => ({ ...prev, portfolio: [...prev.portfolio, newItem] }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-brand-dark font-bold text-sm"
                  >
                    <Plus size={16} /> Add New Project
                  </button>
                </div>

                <div className="space-y-8">
                  {content.portfolio.map((item, idx) => (
                    <div key={item.id} className="glass-panel p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-brand-primary">Project #{idx + 1}</h4>
                        <button 
                          onClick={() => {
                            const newItems = content.portfolio.filter(p => p.id !== item.id);
                            setContent(prev => ({ ...prev, portfolio: newItems }));
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Project Title</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...content.portfolio];
                                newItems[idx].title = e.target.value;
                                setContent(prev => ({ ...prev, portfolio: newItems }));
                              }}
                              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-sm focus:border-brand-primary outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                            <textarea 
                              value={item.desc}
                              onChange={(e) => {
                                const newItems = [...content.portfolio];
                                newItems[idx].desc = e.target.value;
                                setContent(prev => ({ ...prev, portfolio: newItems }));
                              }}
                              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-sm focus:border-brand-primary outline-none h-32"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Features (Comma separated)</label>
                            <textarea 
                              value={item.features.join(', ')}
                              onChange={(e) => {
                                const newItems = [...content.portfolio];
                                newItems[idx].features = e.target.value.split(',').map(f => f.trim());
                                setContent(prev => ({ ...prev, portfolio: newItems }));
                              }}
                              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-sm focus:border-brand-primary outline-none h-20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Images (URLs, one per line)</label>
                            <textarea 
                              value={item.images.join('\n')}
                              onChange={(e) => {
                                const newItems = [...content.portfolio];
                                newItems[idx].images = e.target.value.split('\n').map(img => img.trim()).filter(img => img !== '');
                                setContent(prev => ({ ...prev, portfolio: newItems }));
                              }}
                              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-sm focus:border-brand-primary outline-none h-32"
                              placeholder="https://example.com/image1.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'contact' && (
              <motion.div 
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="glass-panel p-8">
                  <h3 className="text-xl font-bold mb-6">Contact Section Editor</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Title (use \n for line break)</label>
                      <input 
                        type="text" 
                        value={content.contact.title}
                        onChange={(e) => setContent(prev => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Sub-Title</label>
                      <textarea 
                        value={content.contact.subTitle}
                        onChange={(e) => setContent(prev => ({ ...prev, contact: { ...prev.contact, subTitle: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all h-24" 
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Team Members</h3>
                    <button 
                      onClick={() => {
                        const newMember = { id: Math.random().toString(36).substr(2, 9), name: 'New Member', role: 'Position', phone: '+62...' };
                        setContent(prev => ({ ...prev, contact: { ...prev.contact, team: [...prev.contact.team, newMember] } }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-brand-dark font-bold text-sm"
                    >
                      <Plus size={16} /> Add Member
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {content.contact.team.map((member, idx) => (
                      <div key={member.id} className="p-4 bg-white/5 rounded-xl border border-white/10 grid md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Name</label>
                          <input 
                            type="text" 
                            value={member.name}
                            onChange={(e) => {
                              const newTeam = [...content.contact.team];
                              newTeam[idx].name = e.target.value;
                              setContent(prev => ({ ...prev, contact: { ...prev.contact, team: newTeam } }));
                            }}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Role</label>
                          <input 
                            type="text" 
                            value={member.role}
                            onChange={(e) => {
                              const newTeam = [...content.contact.team];
                              newTeam[idx].role = e.target.value;
                              setContent(prev => ({ ...prev, contact: { ...prev.contact, team: newTeam } }));
                            }}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Phone</label>
                          <input 
                            type="text" 
                            value={member.phone}
                            onChange={(e) => {
                              const newTeam = [...content.contact.team];
                              newTeam[idx].phone = e.target.value;
                              setContent(prev => ({ ...prev, contact: { ...prev.contact, team: newTeam } }));
                            }}
                            className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:border-brand-primary outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newTeam = content.contact.team.filter(m => m.id !== member.id);
                            setContent(prev => ({ ...prev, contact: { ...prev.contact, team: newTeam } }));
                          }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">User Management</h3>
                  <button 
                    onClick={fetchUsers}
                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                    title="Refresh Users"
                  >
                    <Loader2 size={20} className={cn(isLoadingUsers && "animate-spin")} />
                  </button>
                </div>

                <div className="glass-panel overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Email</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <UsersIcon size={16} />
                              </div>
                              <span className="text-sm font-medium">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              u.role === 'admin' ? "bg-brand-primary/20 text-brand-primary" : "bg-gray-500/20 text-gray-400"
                            )}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              {u.role === 'user' ? (
                                <button 
                                  onClick={() => handleUpdateRole(u.uid, 'admin')}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all text-xs font-bold"
                                >
                                  <UserCheck size={14} /> Make Admin
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleUpdateRole(u.uid, 'user')}
                                  disabled={u.email === "eleazaragungnugroho@gmail.com"}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold disabled:opacity-30"
                                >
                                  <UserX size={14} /> Revoke Admin
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'footer' && (
              <motion.div 
                key="footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="glass-panel p-8">
                  <h3 className="text-xl font-bold mb-6">Footer & General Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Company Name</label>
                      <input 
                        type="text" 
                        value={content.footer.companyName}
                        onChange={(e) => setContent(prev => ({ ...prev, footer: { ...prev.footer, companyName: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Copyright Text</label>
                      <input 
                        type="text" 
                        value={content.footer.copyright}
                        onChange={(e) => setContent(prev => ({ ...prev, footer: { ...prev.footer, copyright: e.target.value } }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
