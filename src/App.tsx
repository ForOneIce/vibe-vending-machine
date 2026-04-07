import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from './config';
import { Coins, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  website: string;
  version: string;
}

const VendingMachine = () => {
  const [projects, setProjects] = useState<Project[]>(config.projects);
  const [dispensedProject, setDispensedProject] = useState<Project | null>(null);
  const [isDispensing, setIsDispensing] = useState(false);

  const handlePurchase = (project: Project) => {
    if (isDispensing) return;
    setIsDispensing(true);
    setDispensedProject(project);
    
    // Remove from shelf
    setProjects(prev => prev.filter(p => p.id !== project.id));

    // Wait for falling animation, then open new tab
    setTimeout(() => {
      window.open(project.website, '_blank');
      
      // Reset after a delay so they can buy again
      setTimeout(() => {
        setDispensedProject(null);
        setIsDispensing(false);
      }, 500);
    }, 1200);
  };

  const shelves: Project[][] = [[], [], []];
  projects.forEach((project, idx) => {
    shelves[idx % 3].push(project);
  });

  return (
    <div className="relative w-[360px] h-[680px] sm:w-[420px] sm:h-[750px] bg-[#f8f9fa] rounded-t-2xl rounded-b-md shadow-2xl border-x-8 border-t-8 border-b-4 border-gray-300 overflow-hidden flex flex-col p-2 sm:p-3 relative z-10">
      
      {/* Top Banner / Light */}
      <div className="w-full h-10 bg-white rounded-t-xl mb-3 flex items-center justify-center border-b-2 border-gray-200 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
        <span className="text-gray-500 font-bold tracking-widest text-sm drop-shadow-sm">INDIE WORKS</span>
      </div>

      {/* Main Glass Display */}
      <div className="w-full flex-1 bg-[#1a1c23] rounded-lg border-4 border-[#3a3f4c] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] p-2 sm:p-3 flex flex-col gap-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        
          {shelves.map((shelf, shelfIdx) => (
            <div key={shelfIdx} className="relative w-full flex-1 flex flex-col justify-end min-h-[130px]">
              
              {/* Scrollable Container */}
              <div className="flex overflow-x-auto gap-3 sm:gap-4 hide-scrollbar snap-x pb-1 items-end relative z-10 w-full pl-2">
                <AnimatePresence mode="popLayout">
                  {shelf.map((project) => (
                    <motion.div
                      layout
                      layoutId={`product-${project.id}`}
                      key={project.id}
                      className="flex-shrink-0 w-[72px] sm:w-20 flex flex-col items-center gap-1 snap-center cursor-pointer group"
                      onClick={() => handlePurchase(project)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: 150, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Bottle/Can Body (Site Thumbnail) */}
                      <div className="w-full h-[100px] sm:h-[110px] bg-white rounded-md overflow-hidden shadow-[2px_4px_10px_rgba(0,0,0,0.5)] border-2 border-gray-300 group-hover:border-[#ff4d4f] transition-colors relative flex flex-col">
                        <div className="h-3 bg-gray-200 w-full flex items-center justify-center border-b border-gray-300">
                          <div className="w-6 h-[2px] bg-gray-400 rounded-full"></div>
                        </div>
                        <img 
                          src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(project.website)}?w=300`} 
                          alt={project.name}
                          className="w-full flex-1 object-cover object-top"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ddd"/><text x="50" y="50" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="%23666">Preview</text></svg>'
                          }}
                        />
                        {/* Reflection highlight */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none"></div>
                      </div>

                      {/* Price / Button Tag */}
                      <div className="bg-[#2a2d36] rounded-full px-2 py-[2px] sm:py-1 mt-1 shadow-md border border-gray-600 flex items-center justify-center gap-1 group-hover:bg-[#ff4d4f] transition-colors w-full">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 group-hover:bg-green-400 shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-colors"></div>
                        <span className="text-gray-200 text-[9px] sm:text-[10px] font-mono leading-none">{project.version}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {shelf.length === 0 && (
                  <div className="w-[72px] sm:w-20 h-[100px] sm:h-[110px] flex-shrink-0 opacity-0"></div>
                )}
              </div>

              {/* Shelf Background Line */}
              <div className="h-4 w-full bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm border-b-2 border-gray-800 shadow-xl relative z-0 mt-[-8px]">
                <div className="absolute inset-0 bg-white/10"></div>
              </div>
            </div>
          ))}
        
      </div>

      {/* Control Panel Area */}
      <div className="mt-4 h-[180px] sm:h-[200px] bg-gray-200 rounded-lg w-full p-3 sm:p-4 flex flex-col justify-between relative shadow-inner border border-gray-300">
        <div className="flex justify-between items-start">
          
          {/* Instructions / Deco Display */}
          <div className="flex flex-col gap-2">
            <div className="w-24 sm:w-28 h-10 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center border-4 border-gray-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
              <span className={`font-mono text-sm sm:text-base ${projects.length > 0 ? 'text-[#ff4d4f] animate-pulse' : 'text-gray-600'}`}>
                {projects.length > 0 ? 'AVAILABLE' : 'SOLD OUT'}
              </span>
            </div>
            
            <div className="flex gap-2">
               <div className="w-8 h-4 bg-red-400 rounded-sm shadow-inner"></div>
               <div className="w-8 h-4 bg-blue-400 rounded-sm shadow-inner"></div>
            </div>
          </div>

          {/* Coin Slot & Sponsor */}
          <div className="flex flex-col items-end gap-2">
            <a 
              href={config.sponsorshipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group bg-white p-2 rounded-lg shadow-md border-2 border-gray-300 hover:border-yellow-400 transition-colors"
            >
              <div className="w-10 sm:w-12 h-12 sm:h-14 bg-gray-300 rounded-md border-2 border-gray-400 flex flex-col items-center justify-center shadow-inner group-hover:bg-yellow-100 transition-colors relative">
                <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-black rounded-full mb-1"></div>
                <Coins size={16} className="text-yellow-600 group-hover:animate-bounce absolute bottom-1 right-1" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-600 flex items-center gap-1 group-hover:text-yellow-600">
                SUPPORT <ExternalLink size={10} />
              </span>
            </a>
          </div>
        </div>

        {/* Dispenser Flap */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[200px] sm:w-[240px] h-20 sm:h-24 bg-gray-900 rounded-lg border-4 border-gray-400 relative overflow-hidden shadow-[inset_0_15px_30px_rgba(0,0,0,0.8)] flex items-end justify-center pb-2">
          {/* Flap cover */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 transform origin-top rotate-x-12 border-b-2 border-gray-500 shadow-md z-30 opacity-80 pointer-events-none"></div>
          
          <AnimatePresence>
            {dispensedProject && (
              <motion.div
                layoutId={`product-${dispensedProject.id}`}
                className="w-16 sm:w-20 h-24 sm:h-28 bg-white rounded flex items-center justify-center relative z-20 shadow-2xl overflow-hidden border-2 border-gray-300"
                initial={{ y: -250, scale: 0.5, rotate: -30 }}
                animate={{ y: 10, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <div className="h-3 bg-gray-200 w-full absolute top-0 left-0 flex items-center justify-center border-b border-gray-300 z-10">
                   <div className="w-6 h-[2px] bg-gray-400 rounded-full"></div>
                </div>
                <img 
                  src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(dispensedProject.website)}?w=300`} 
                  alt={dispensedProject.name}
                  className="w-full h-full object-cover pt-3"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Vending Machine Feet */}
      <div className="absolute -bottom-2 left-4 w-8 h-4 bg-gray-800 rounded-b-md"></div>
      <div className="absolute -bottom-2 right-4 w-8 h-4 bg-gray-800 rounded-b-md"></div>
    </div>
  );
};

export default function App() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans"
      style={{ backgroundImage: 'url("/images/bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24">
        
        {/* Left Side: Typography / Aesthetic Text */}
        <div className="text-white text-center lg:text-right w-full lg:w-80 flex flex-col gap-2 order-2 lg:order-1 mt-4 lg:mt-0">
          <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight text-white drop-shadow-xl" style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.2)'}}>
            INDIE<br/>WORKS.
          </h1>
          <div className="h-1 w-16 bg-[#ff4d4f] mx-auto lg:ml-auto lg:mr-0 mb-4 shadow-lg"></div>
          <p className="text-base sm:text-lg text-white/90 drop-shadow-md font-medium max-w-sm mx-auto lg:ml-auto lg:mr-0" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
            Select a project from the vending machine. Click to dispense and preview.
          </p>
          <p className="text-xs sm:text-sm text-white/70 mt-4 font-mono">
             PROJECTS: {config.projects.length} | STATUS: ONLINE
          </p>
        </div>

        {/* Right Side: Vending Machine */}
        <div className="order-1 lg:order-2 flex-shrink-0 relative">
          {/* Shadow under machine */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/40 blur-xl rounded-full z-0"></div>
          <VendingMachine />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
