import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Homepage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    function handleScroll() {
      const position = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll percentage (0 to 1)
      const scrollPercentage = Math.min(position / windowHeight, 1);
      setScrollPosition(scrollPercentage);
      
      // If scrolled to bottom, redirect to browser
      if (scrollPercentage >= 0.9) {
        setTimeout(() => {
          setLocation('/browser');
        }, 500);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setLocation]);

  const handleArrowClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="h-[200vh] overflow-y-auto">
      {/* First viewport - Logo section */}
      <div className="h-screen flex flex-col items-center justify-center relative xeno-gradient">
        {/* Logo animation container */}
        <div 
          className="relative transition-all duration-700 ease-in-out"
          style={{ 
            transform: `scale(${1 - scrollPosition * 0.5}) translateY(-${scrollPosition * 100}px)`,
            opacity: 1 - scrollPosition
          }}
        >
          {/* The Xeno logo */}
          <div className="flex items-center space-x-4">
            <span className="text-9xl font-extrabold text-white">xeno</span>
            <div className="w-20 h-20 border-4 border-white rounded-lg relative">
              <div className="absolute top-1 right-1 flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-xl mt-6 text-center">
            A secure browser with powerful ad-blocking capabilities
          </p>
        </div>
        
        {/* Scroll down arrow */}
        <div 
          className="absolute bottom-10 animate-bounce cursor-pointer transition-opacity duration-300"
          style={{ opacity: 1 - scrollPosition * 2 }}
          onClick={handleArrowClick}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          <p className="text-white text-sm mt-2">Explore Xeno</p>
        </div>
      </div>
      
      {/* Second viewport - Feature highlights */}
      <div className="h-screen flex flex-col items-center justify-center xeno-gradient p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="block" 
            title="Advanced Ad Blocking" 
            description="Block unwanted ads and trackers for a cleaner browsing experience" 
          />
          <FeatureCard 
            icon="security" 
            title="Enhanced Privacy" 
            description="Browse securely with built-in protection against tracking and data collection" 
          />
          <FeatureCard 
            icon="format_list_bulleted" 
            title="Whitelist Management" 
            description="Easily manage allowed websites to customize your browsing experience" 
          />
        </div>

        <button 
          className="mt-12 px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg"
          onClick={() => setLocation('/browser')}
        >
          Launch Xeno Browser
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl hover:transform hover:scale-105 transition-all">
      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
        <span className="material-icons text-white text-2xl">{icon}</span>
      </div>
      <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
}