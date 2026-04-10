import React from 'react';
import { 
  Cpu, 
  Monitor, 
  Users, 
  ChevronRight, 
  Building2, 
  School, 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { WebsiteContent } from '../types';

export const Hero: React.FC<{ content: WebsiteContent['hero'] }> = ({ content }) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${content.imageUrl})` }} />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Zap size={14} /> {content.tagline}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          {content.headline.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line.includes('Integration') ? <span className="gradient-text">{line}</span> : line}
              <br />
            </React.Fragment>
          ))}
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
          {content.subHeadline}
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 rounded-xl bg-brand-primary text-brand-dark font-bold hover:scale-105 transition-transform flex items-center gap-2">
            Konsultasi Gratis <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
            Lihat Produk
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative"
      >
        <div className="relative z-10 glass-panel p-4 overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt="Hero Image" 
            className="rounded-xl w-full h-auto shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 right-8 bg-brand-primary/90 text-brand-dark p-4 rounded-lg shadow-xl backdrop-blur-md">
            <div className="text-2xl font-bold">{content.stats.value}</div>
            <div className="text-xs font-bold uppercase tracking-wider">{content.stats.label}</div>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 glass-panel p-6 glow-primary">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-secondary/20 rounded-lg text-brand-secondary">
              <Monitor size={24} />
            </div>
            <div>
              <div className="text-sm font-bold">LED Videotron</div>
              <div className="text-xs text-gray-400">P1.8 - P6 Solutions</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const IconMap: Record<string, any> = {
  Building2: <Building2 />,
  School: <School />,
  Home: <Home />,
  Monitor: <Monitor />,
  Users: <Users />
};

export const Solutions: React.FC<{ solutions: WebsiteContent['solutions'] }> = ({ solutions }) => (
  <section id="solutions" className="py-24 bg-brand-surface/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Solusi <span className="text-brand-primary">Cerdas</span> Kami</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Kami tidak hanya menjual produk, kami membangun ekosistem yang bekerja untuk Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {solutions.map((s, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className={cn("p-8 rounded-3xl border border-white/10 bg-gradient-to-br transition-all", s.color)}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-brand-primary">
              {IconMap[s.icon] || <Zap />}
            </div>
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-6">{s.desc}</p>
            <button className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
              Pelajari Lebih Lanjut <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export const Products: React.FC<{ products: WebsiteContent['products'] }> = ({ products }) => (
  <section id="products" className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Katalog <span className="text-brand-primary">LED Videotron</span></h2>
          <p className="text-gray-400">Teknologi visual terbaik untuk kebutuhan indoor dan outdoor.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <div key={i} className="glass-panel p-6 hover:border-brand-primary/50 transition-all group">
            <div className="aspect-video bg-brand-dark rounded-xl mb-6 overflow-hidden relative">
              <img 
                src={p.imageUrl || `https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=400&h=250&sig=${i}`} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-brand-dark/80 backdrop-blur-md rounded text-[10px] font-bold uppercase">
                {p.type}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase font-bold tracking-wider">Pixel Pitch</span>
                <span className="text-gray-200">{p.pixelPitch}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase font-bold tracking-wider">Brightness</span>
                <span className="text-gray-200">{p.brightness}</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-bold hover:bg-brand-primary hover:text-brand-dark transition-all">
              Minta Penawaran
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Portfolio: React.FC<{ items: WebsiteContent['portfolio'] }> = ({ items }) => (
  <section id="portfolio" className="py-24 bg-brand-dark relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Proyek <span className="text-brand-primary">Terbaik</span> Kami</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Dedikasi kami dalam menghadirkan teknologi terbaik untuk setiap klien.</p>
      </div>

      <div className="space-y-24">
        {items.map((item, index) => (
          <div key={item.id} className={cn(
            "grid md:grid-cols-2 gap-16 items-center",
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          )}>
            <div className={index % 2 === 1 ? "md:order-2" : ""}>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {item.title.split('&').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {part.includes('Church') || part.includes('Proyek') ? <span className="text-brand-primary">{part}</span> : part}
                    {i === 0 && item.title.includes('&') && ' &'}
                  </React.Fragment>
                ))}
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {item.desc}
              </p>
              <ul className="space-y-4 mb-8">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="text-brand-primary" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(
              "grid grid-cols-2 gap-4",
              index % 2 === 1 ? "md:order-1" : ""
            )}>
              {item.images.length > 0 && (
                <img src={item.images[0]} className="rounded-2xl w-full h-full object-cover aspect-[3/4]" alt={`${item.title} 1`} referrerPolicy="no-referrer" />
              )}
              <div className="space-y-4">
                {item.images.slice(1, 3).map((img, i) => (
                  <img key={i} src={img} className="rounded-2xl w-full object-cover aspect-video" alt={`${item.title} ${i + 2}`} referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Contact: React.FC<{ content: WebsiteContent['contact'] }> = ({ content }) => (
  <section id="contact" className="py-24 bg-brand-surface">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          {content.title.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h2>
        <p className="text-gray-400 mb-12">{content.subTitle}</p>
        
        <div className="space-y-8">
          {content.team.map((c, i) => (
            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all">
              <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Users size={20} />
              </div>
              <div>
                <div className="font-bold">{c.name}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{c.role}</div>
                <div className="text-brand-primary text-sm font-mono">{c.phone}</div>
              </div>
              <button className="ml-auto p-3 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-brand-dark transition-all">
                <Phone size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8">
        <h3 className="text-2xl font-bold mb-8">Kirim Pesan</h3>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Layanan yang Diminati</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all appearance-none">
              <option>Smart Office</option>
              <option>Smart Classroom</option>
              <option>Smart Home</option>
              <option>LED Videotron</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Pesan</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-brand-primary outline-none transition-all h-32" placeholder="Jelaskan kebutuhan Anda..."></textarea>
          </div>
          <button className="w-full py-4 rounded-xl bg-brand-primary text-brand-dark font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            Kirim Sekarang <Zap size={18} />
          </button>
        </form>
      </div>
    </div>
  </section>
);
