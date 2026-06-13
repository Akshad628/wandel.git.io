import React, { useState, useEffect, useRef } from 'react';

import {
  Home, Briefcase, Calendar, Terminal, Users, Clock, Menu, X,
  ChevronRight, ChevronLeft, Instagram, Linkedin, Code, Layers,
  Award, BookOpen, Globe, Monitor, Send, CheckCircle2, AlertCircle
} from 'lucide-react';

/**
 * Reusable 3D Flip Card Component
 */
const FlipCard = ({ item, color = 'cyan' }) => {
  const Icon = item.icon || Monitor;
  const borderClasses = {
    cyan: 'border-cyan-500/20 group-hover:border-cyan-400',
    green: 'border-green-500/20 group-hover:border-green-400',
    purple: 'border-purple-500/20 group-hover:border-purple-400',
    orange: 'border-orange-500/20 group-hover:border-orange-400',
    blue: 'border-blue-500/20 group-hover:border-blue-400',
  };

  const textColors = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="group w-[380px] md:w-[500px] h-[550px] [perspective:2000px] flex-shrink-0 snap-center">
      <div className="relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-[2.5rem] shadow-2xl cursor-pointer">
        {/* Front */}
        <div className={`absolute inset-0 [backface-visibility:hidden] bg-[#0a1122] rounded-[2.5rem] border ${borderClasses[color] || borderClasses.cyan} overflow-hidden flex flex-col shadow-2xl`}>
          <div className="h-[70%] w-full overflow-hidden relative bg-slate-900 flex items-center justify-center">
            {item.img ? (
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            ) : (
              <Icon size={120} className="opacity-10" />
            )}
            <div className={`absolute top-6 right-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest ${textColors[color]}`}>
              {item.status || item.tag}
            </div>
          </div>
          <div className="h-[30%] flex flex-col justify-center items-center px-10 bg-gradient-to-t from-[#05080f] to-[#0a1122] border-t border-white/5">
            <h3 className="text-3xl font-black text-white tracking-tight text-center uppercase group-hover:text-cyan-400 transition-colors leading-none">{item.title}</h3>
          </div>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#070b14] rounded-[2.5rem] border-2 ${borderClasses[color] || borderClasses.cyan} p-12 flex flex-col justify-center shadow-inner relative h-full w-full`}>
          <span className={`w-fit px-4 py-1.5 rounded-lg border border-white/10 text-[10px] uppercase tracking-[0.2em] bg-white/5 font-black mb-8 ${textColors[color]}`}>{item.tag}</span>
          <h3 className={`text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight leading-none ${textColors[color]}`}>{item.title}</h3>
          <p className="text-slate-300 leading-relaxed text-lg md:text-xl overflow-y-auto max-h-[220px] font-medium pr-2 custom-scrollbar text-justify">{item.desc}</p>
          <div className="mt-auto pt-8 flex items-center gap-4 text-slate-500 font-mono text-sm uppercase tracking-widest border-t border-white/5 w-full">
            <Calendar size={18} /> {item.date}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Team Member Card
 */
const TeamCard = ({ item, size = 'normal' }) => {
  const sizeClasses = {
    large: { div: 'w-48 md:w-60 h-48 md:h-60', title: 'text-2xl', role: 'text-sm' },
    medium: { div: 'w-40 md:w-52 h-40 md:h-52', title: 'text-xl', role: 'text-sm' },
    normal: { div: 'w-36 md:w-44 h-36 md:h-44', title: 'text-lg', role: 'text-[11px]' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="animate-on-scroll opacity-0 flex flex-col items-center group cursor-pointer w-full max-w-[240px] px-2">
      <div className={`relative mb-6 ${currentSize.div} rounded-full overflow-hidden border-4 ${item.isLead ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.4)]' : 'border-slate-800'} ${item.isLead ? 'group-hover:border-cyan-200' : 'group-hover:border-green-400'} transition-all shadow-2xl`}>
        <img 
          src={`assets/${item.img}`} 
          alt={item.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
          onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${item.name.replace(/ /g, '+')}&background=0A1128&color=${item.isLead ? '00FFFF' : '4ADE80'}&size=512`} 
        />
      </div>
      <h3 className={`${currentSize.title} font-black text-center ${item.isLead ? 'text-cyan-300 group-hover:text-cyan-100' : 'text-slate-200 group-hover:text-green-400'} uppercase tracking-tight`}>
        {item.name}
      </h3>
      <p className={`${currentSize.role} font-mono text-center text-slate-400 uppercase tracking-[0.4em] mt-2 font-bold`}>
        {item.role}
      </p>
    </div>
  );
};


export default function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEventTab, setActiveEventTab] = useState('conducted');
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false });

  const projectCarouselRef = useRef(null);
  const eventCarouselRef = useRef(null);
  const observerRef = useRef(null);
  const nameInputRef = useRef(null);

  // --- Project & Event Data ---
  const projects = [
    { title: 'Realish Diwali', desc: 'VR alternative to Diwali crackers with focus on gamification and environmental awareness. Reimagining traditional festivities in a virtual space.', date: 'JULY - DEC 2025', status: 'Ongoing', tag: 'Research Project', color: 'cyan', img: 'assets/RDCover.jpg' },
    { title: 'The Silence that Remains', desc: 'An immersive XR art concept sparked by the evocative composition "The Silence that Remains – Mokshamu Galada" by Agam. Draws inspiration from the revolutionary volumism style pioneered by VR artists. At its core, the piece reflects on themes of climate change, loss, and inner stillness.', date: 'JULY 15, 2025', status: 'Accepted', tag: 'WebXR Artwork', color: 'green', img: 'assets/TSTRCover.jpg' },
    { title: 'The Last Exit', desc: 'A narrative-driven immersive experience exploring decision-making and environmental consequences in a high-fidelity environmental simulation. Players navigate complex scenarios where choices impact the digital ecosystem.', date: 'SEPT 2025', status: 'In Development', tag: 'Interactive Story', color: 'purple', icon: Monitor }
  ];

  const eventsData = {
    conducted: [
      { title: 'Inside the Frame', desc: 'Intro to WebXR workshop focusing on immersive storytelling using the project "The Silence That Remains". Hands-on training for students in creating immersive web-based experiences.', date: 'OCT 10-11, 2025', tag: 'Workshop', color: 'cyan', icon: BookOpen },
      { title: 'Exhibition of Silence', desc: 'An immersive art showcase of "The Silence That Remains" held as part of a campus-wide exhibition. Visitors experienced volumetric painting combined with Indian classical music.', date: 'AUG 06-07, 2025', tag: 'Exhibition', color: 'green', icon: Award }
    ],
    participated: [
      { title: 'Beyond CHI', desc: 'Highlights exceptional research from wide-ranging HCI publications at IDC School of Design, IIT Bombay. Showcasing global research standards and experimental interaction design.', date: 'NOV 29, 2025', tag: 'Conference', color: 'orange', icon: Layers },
      { title: 'XR Creator Con', desc: 'Online International XR hackathon hosted by Immersive Insiders. Collaboration with international partners on future XR tools and spatial computing solutions.', date: 'OCT 31 - NOV 16', tag: 'Hackathon', color: 'blue', icon: Code },
      { title: 'IndiaHCI Conference', desc: 'International Conference on Design and Human Computer Interaction hosted at IIIT Delhi. Presenting research on the global stage and engaging with the HCI community.', date: 'NOV 7-9, 2025', tag: 'Conference', color: 'purple', icon: Globe }
    ]
  };

  // --- Team Data ---
  const teamRow1 = [
    { name: 'Krishna Priya Choudoor', role: 'Lead Researcher', img: 'kps.jpg', isLead: true },
    { name: 'Ananya Pulla', role: 'XR Design and Development', img: 'ananya.jpg' },
    { name: 'Akshad Mishra', role: 'XR Design and Development', img: 'akshad.jpg' }
  ];

  const teamRow2 = [
    { name: 'Mrudula Ganduri', role: 'Music, Administration, and Operations', img: 'mrudula.jpg' },
    { name: 'Spoorthy Reddy', role: 'Field Research and Community Documentation', img: 'spoorthy.jpg' },
    { name: 'Navya Gonela', role: 'Development, User Studies, and Evaluation', img: 'navya.jpg' },
    { name: 'Sree Hasa', role: 'Development, User Studies, and Evaluation', img: 'sreehasa.jpg' }
  ];

  const teamRow3 = [
    { name: 'Sravya Seethiraju', role: 'Music, Administration, and Operations', img: 'sravya.jpg' },
    { name: 'Nikhil Chandra Reddy', role: 'Field Research and Community Documentation', img: 'nikhil.jpg' },
    { name: 'Srivani Susarla', role: 'Sound Director & Music Lead', img: 'srivani.jpg' },
    { name: 'Santosh Nalla', role: 'Application Architect & Technical Lead', img: 'santosh.jpg' },
    { name: 'Veekshana Singh', role: 'Finance Strategy & Environmental Research', img: 'veekshana.jpg' }
  ];


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    script.onload = () => {
      setTimeout(() => setIsLoading(false), 1500);
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (isLoading || !window.anime) return;

    window.anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: '.hero-title .char', translateY: [50, 0], opacity: [0, 1], duration: 1200, delay: (el, i) => 200 + 30 * i })
      .add({ targets: '.hero-fade-in', translateY: [20, 0], opacity: [0, 1], duration: 1000, delay: window.anime.stagger(100) }, '-=800');

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.anime({ targets: entry.target, translateY: [60, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutCubic' });
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observerRef.current.observe(el));

    const handleMouseMove = (e) => {
      window.anime({
        targets: '.cursor-crystal',
        translateX: e.clientX,
        translateY: e.clientY,
        duration: (el, i) => 50 + i * 80,
        easing: 'easeOutQuad'
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLoading]);

  const scrollCarousel = (ref, direction) => {
    const amount = 500;
    ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus({ loading: true, success: false });
    
    setTimeout(() => {
      setBookingStatus({ loading: false, success: true });
      e.target.reset();
      setTimeout(() => setBookingStatus({ loading: false, success: false }), 5000);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex flex-col justify-center items-center text-cyan-400 font-mono">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin"></div>
        </div>
        <p className="tracking-[0.3em] animate-pulse uppercase font-black">INITIALIZING REALITY...</p>
      </div>
    );
  }

  const navLinks = [
    { name: 'Home', id: 'home', icon: Home },
    { name: 'Atelier', id: 'atelier', icon: Briefcase },
    { name: 'Events', id: 'events', icon: Calendar },
    { name: 'Slots', id: 'slots', icon: Terminal },
    { name: 'Team', id: 'team', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">

      {/* Crystal Cursor */}
      <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="cursor-crystal absolute top-0 left-0" style={{ width: `${12 - i * 3}px`, height: `${12 - i * 3}px`, marginLeft: '-6px', marginTop: '-6px', opacity: 1 - (i * 0.3) }}>
            <div className="w-full h-full bg-cyan-400 rotate-45 shadow-[0_0_15px_rgba(0,255,255,0.8)] border border-white/50"></div>
          </div>
        ))}
      </div>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#070b14]">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-[#070b14] z-10"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.4) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <header className="fixed top-0 left-0 w-full bg-[#070b14]/80 border-b border-cyan-900/50 shadow-2xl z-50 backdrop-blur-xl h-20 px-[5%] flex justify-between items-center">
        <div onClick={() => scrollTo('home')} className="flex items-center gap-4 cursor-pointer group">
          <div className="relative">
            <img src="assets/wandel logo.png" alt="Logo" className="w-12 h-12 rounded-xl border border-cyan-500/30 group-hover:border-cyan-400 transition-all z-10 relative" />
            <div className="absolute inset-0 bg-cyan-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 uppercase leading-none">Wandel</h1>
            <p className="text-[12px] tracking-[0.8em] text-cyan-500/50 uppercase font-mono mt-1 font-bold">Reality</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="relative flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-300 transition-all group">
              <link.icon size={14} className="group-hover:rotate-12 transition-transform" /> {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_cyan]"></span>
            </button>
          ))}
        </nav>
        <button className="md:hidden text-cyan-400 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#070b14]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button className="absolute top-6 right-6 text-cyan-400" onClick={() => setIsMenuOpen(false)}><X size={40} /></button>
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="text-2xl font-black uppercase tracking-[0.3em] text-cyan-400">{link.name}</button>
          ))}
        </div>
      )}

      <main className="relative z-10 pt-20 w-full overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col lg:flex-row justify-between items-center w-full px-[5%] py-20 gap-12 relative">
          <div className="w-full lg:w-1/2 z-10 flex flex-col items-start text-left">
            <h2 className="hero-title text-5xl sm:text-6xl xl:text-8xl font-black mb-6 leading-tight uppercase tracking-tighter">
              {"Enter The ".split('').map((char, i) => <span key={i} className="char inline-block opacity-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</span>)}
              <br />
              {"New Reality".split('').map((char, i) => <span key={i} className="char inline-block opacity-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</span>)}
            </h2>
            <div className="hero-fade-in space-y-6 text-lg xl:text-xl text-slate-300 max-w-xl opacity-0">
              <div className="pl-4 border-l-2 border-cyan-500 bg-cyan-500/5 py-4 rounded-r-xl">
                <p className="font-bold text-white mb-2 text-2xl uppercase tracking-tight">Welcome to Wandel Reality!</p>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 font-medium">An initiative to explore the future of reality through immersive storytelling and game design.</p>
                <p className="text-slate-400 text-sm md:text-base font-bold italic">-"Pixels. Polygons. Possibilities."</p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => scrollTo('atelier')} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-[#070b14] rounded-full font-black hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all uppercase tracking-widest text-xs flex items-center gap-2">Explore Work <ChevronRight size={18} /></button>
                <button onClick={() => scrollTo('slots')} className="px-10 py-4 border-2 border-cyan-500/40 text-cyan-400 rounded-full font-black hover:bg-cyan-500/10 transition-all uppercase tracking-widest text-xs backdrop-blur-xl">Access Terminal</button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center items-center relative h-[450px] sm:h-[600px]">
            <img src="assets/wandel background.png" alt="Glow" className="absolute w-[140%] max-w-2xl object-contain opacity-70 z-0 animate-pulse duration-[5s]" />
            <img src="assets/wandel dino.png" alt="Logo" className="absolute w-[130%] max-w-[450px] object-contain z-13 drop-shadow-2xl animate-float" />
          </div>
        </section>

        {/* Atelier Section */}
        <section id="atelier" className="py-24 w-full relative border-t border-cyan-900/30">
          <div className="w-full text-center mb-16 px-6">
            <h2 className="animate-on-scroll opacity-0 text-4xl md:text-6xl font-black mb-4 text-white uppercase tracking-tighter">Atelier: Projects</h2>
            <p className="animate-on-scroll opacity-0 text-base md:text-xl max-w-2xl mx-auto text-cyan-200/60 font-medium font-mono uppercase tracking-widest">Immersive Research Initiatives</p>
          </div>
          <div className="relative px-[5%] group/carousel">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-30 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity">
              <button onClick={() => scrollCarousel(projectCarouselRef, 'left')} className="w-14 h-14 rounded-full bg-cyan-900/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center backdrop-blur-md pointer-events-auto hover:bg-cyan-500 hover:text-white transition-all"><ChevronLeft size={32} /></button>
              <button onClick={() => scrollCarousel(projectCarouselRef, 'right')} className="w-14 h-14 rounded-full bg-cyan-900/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center backdrop-blur-md pointer-events-auto hover:bg-cyan-500 hover:text-white transition-all"><ChevronRight size={32} /></button>
            </div>
            <div ref={projectCarouselRef} className="flex gap-10 overflow-x-hidden snap-x snap-mandatory pb-12 scroll-smooth">
              {projects.map((p, i) => <FlipCard key={i} item={p} color={p.color} />)}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-32 bg-[#05080f]/90 border-y border-cyan-900/30 w-full">
          <div className="max-w-screen-2xl mx-auto text-center px-[5%]">
            <h2 className="animate-on-scroll opacity-0 text-4xl md:text-6xl font-black mb-16 text-white tracking-tighter uppercase">Events</h2>
            <div className="flex justify-center gap-6 mb-20">
              {['conducted', 'participated'].map((tab) => (
                <button key={tab} onClick={() => setActiveEventTab(tab)} className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all border-2 ${activeEventTab === tab ? 'border-cyan-400 bg-cyan-400 text-[#070b14]' : 'border-cyan-500/20 text-slate-500 hover:border-cyan-400'}`}>
                  {tab === 'conducted' ? 'Conducted' : 'Participated'}
                </button>
              ))}
            </div>
            <div className="relative group/carousel">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-30 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button onClick={() => scrollCarousel(eventCarouselRef, 'left')} className="w-14 h-14 rounded-full bg-cyan-900/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center backdrop-blur-md pointer-events-auto hover:bg-cyan-500 hover:text-white transition-all"><ChevronLeft size={32} /></button>
                <button onClick={() => scrollCarousel(eventCarouselRef, 'right')} className="w-14 h-14 rounded-full bg-cyan-900/60 border border-cyan-500/20 text-cyan-400 flex items-center justify-center backdrop-blur-md pointer-events-auto hover:bg-cyan-500 hover:text-white transition-all"><ChevronRight size={32} /></button>
              </div>
              <div ref={eventCarouselRef} className="flex gap-10 overflow-x-hidden snap-x snap-mandatory pb-12 scroll-smooth">
                {eventsData[activeEventTab].map((e, i) => <FlipCard key={i} item={e} color={e.color} />)}
              </div>
            </div>
          </div>
        </section>

        {/* Slot Booking Section */}
        <section id="slots" className="py-32 w-full px-[5%] max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
            <div className="flex-1 animate-on-scroll opacity-0 flex flex-col">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">Request <br /><span className="text-cyan-400">A Slot</span></h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">Book a session for collaboration or Networking.</p>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {[
                  { title: 'Code Review', icon: Code },
                  { title: 'Mentored Programming', icon: Users },
                  { title: 'DIY Programming', icon: Layers }
                ].map((item, i) => (
                  <div key={i} onClick={() => nameInputRef.current?.focus()} className="flex flex-col justify-between bg-[#0a1122]/60 border-2 border-cyan-500/10 rounded-[2rem] p-8 hover:border-cyan-400 transition-all cursor-pointer group relative overflow-hidden flex-1 min-h-[160px]">
                    <div className="p-4 bg-cyan-500/5 rounded-2xl text-cyan-400 w-fit mb-4 group-hover:bg-cyan-400 group-hover:text-[#070b14] transition-all"><item.icon size={28} /></div>
                    <h4 className="text-white font-black text-2xl uppercase tracking-tight leading-none">{item.title}</h4>
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2 mt-4">Schedule <ChevronRight size={14} /></span>
                    <div className="absolute bottom-4 right-6 w-3 h-3 bg-cyan-400 rotate-45 blur-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 animate-on-scroll opacity-0 bg-[#0a1122]/80 border-2 border-cyan-500/20 rounded-[3rem] p-10 md:p-14 shadow-2xl relative backdrop-blur-xl self-stretch flex flex-col justify-center">
              <div className="absolute top-0 right-10 -translate-y-1/2 p-5 bg-cyan-400 rounded-2xl shadow-xl text-[#070b14] font-black uppercase tracking-[0.2em] text-[11px] font-mono leading-none">Portal Terminal</div>
              <form className="space-y-10" onSubmit={handleBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] block pl-1">Full Name</label>
                    <input ref={nameInputRef} name="fullName" required type="text" placeholder="Your Name" className="w-full bg-[#070b14] border-2 border-cyan-500/10 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700 font-bold text-lg" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] block pl-1">Email</label>
                    <input name="email" required type="email" placeholder="your.email@example.com" className="w-full bg-[#070b14] border-2 border-cyan-500/10 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700 font-bold text-lg" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] block pl-1">Subject / Agenda</label>
                  <input name="agenda" required type="text" placeholder="Research Discussion / Project Review" className="w-full bg-[#070b14] border-2 border-cyan-500/10 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700 font-bold text-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] block pl-1">Date</label>
                    <input name="date" required type="date" className="w-full bg-[#070b14] border-2 border-cyan-500/10 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all [color-scheme:dark] font-bold text-lg" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] block pl-1">Time Slot</label>
                    <input name="time" required type="time" className="w-full bg-[#070b14] border-2 border-cyan-500/10 rounded-2xl px-6 py-5 text-white focus:border-cyan-400 outline-none transition-all [color-scheme:dark] font-bold text-lg" />
                  </div>
                </div>
                <button type="submit" disabled={bookingStatus.loading} className="w-full py-7 bg-gradient-to-r from-cyan-500 to-green-500 text-[#070b14] rounded-2xl font-black uppercase tracking-[0.5em] text-sm hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                  {bookingStatus.loading ? 'PROCESSING...' : 'CONFIRM BOOKING'} <Send size={22} />
                </button>
                {bookingStatus.success && <p className="text-green-400 text-center font-bold animate-pulse text-lg">Booking Confirmed!</p>}
              </form>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-32 bg-[#05080f]/95 border-t border-cyan-900/30 w-full px-[5%] text-center">
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-6xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 uppercase tracking-tighter">Wandel Reality Group</h2>
          
          <div className="flex flex-col gap-24 max-w-screen-2xl mx-auto">
            {/* Core Research Team (3-4-5 Formation) */}
            <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto pt-12 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#05080f] px-8 text-cyan-500 font-mono text-sm tracking-[0.5em] font-black uppercase whitespace-nowrap">Core Research Team</div>
              
              {/* Row 1: 3 Members */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {teamRow1.map((m, i) => <TeamCard key={`row1-${i}`} item={m} size="normal" />)}
              </div>
              
              {/* Row 2: 4 Members */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {teamRow2.map((m, i) => <TeamCard key={`row2-${i}`} item={m} size="normal" />)}
              </div>
              
              {/* Row 3: 5 Members */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-14 w-full">
                {teamRow3.map((m, i) => <TeamCard key={`row3-${i}`} item={m} size="normal" />)}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#03050a] border-t border-cyan-900/50 py-24 px-[5%] w-full relative z-10 text-center md:text-left">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div>
            <p className="text-lg text-slate-300 uppercase tracking-[0.5em] mb-3 font-black">Crafted by <span className="text-cyan-400">Wandel Reality</span> &copy; 2026</p>
            <p className="text-sm text-slate-600 uppercase tracking-[0.3em] font-bold">Krishna Priya Choudoor</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <p className="text-xs font-mono text-cyan-500/80 uppercase tracking-[0.5em] font-black italic">Connect With Evolution</p>
            <div className="flex items-center gap-8 font-bold">
              <a href="https://discord.gg/u5HCPHE8K" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-2xl bg-[#0a1122] border-2 border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5865F2] hover:border-[#5865F2] transition-all shadow-2xl"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg></a>
              <a href="https://www.linkedin.com/in/ar-vr-research-lab" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-2xl bg-[#0a1122] border-2 border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0A66C2] transition-all shadow-2xl"><Linkedin size={28} /></a>
              <a href="https://www.instagram.com/ar.vr.researchlab/" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-2xl bg-[#0a1122] border-2 border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all shadow-2xl"><Instagram size={28} /></a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.3); }
      `}} />
    </div>
  );
}