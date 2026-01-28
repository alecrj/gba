'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameboySound } from '@/hooks/useGameboySound';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useResponsiveScale } from '@/hooks/useResponsiveScale';

type Screen = 'boot' | 'menu' | 'projects' | 'project-detail' | 'about' | 'skills' | 'contact' | 'credits';

interface Project {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  desc: string;
  tech: string[];
  status: string;
  icon: 'plane' | 'phone' | 'browser';
}

// Pixel Art Icons as CSS components
function PixelIcon({ type, size = 12 }: { type: 'plane' | 'phone' | 'browser'; size?: number }) {
  const pixel = size / 8;
  const color = '#9BBC0F';

  const icons: Record<string, number[][]> = {
    plane: [
      [0,0,0,1,0,0,0,0],
      [0,0,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,0],
      [0,0,1,1,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    phone: [
      [0,1,1,1,1,1,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,0,0,0,0,1,0],
      [0,1,1,1,1,1,1,0],
      [0,1,0,1,1,0,1,0],
      [0,1,1,1,1,1,1,0],
    ],
    browser: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1],
    ],
  };

  const grid = icons[type];

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${pixel}px)`,
        gridTemplateRows: `repeat(8, ${pixel}px)`,
        flexShrink: 0,
      }}
    >
      {grid.flat().map((filled, i) => (
        <div
          key={i}
          style={{
            width: pixel,
            height: pixel,
            backgroundColor: filled ? color : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

export default function GameboyPortfolio() {
  const [screen, setScreen] = useState<Screen>('boot');
  const [menuIndex, setMenuIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [bootPhase, setBootPhase] = useState<'flicker' | 'logo' | 'text' | 'ready'>('flicker');
  const [bootText, setBootText] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [creditsUnlocked, setCreditsUnlocked] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);
  const scale = useResponsiveScale(1.5);
  const { soundEnabled, toggleSound, playBlip, playSelect, playBack, playBoot, playSecret } = useGameboySound();

  const menuItems = creditsUnlocked
    ? ['PROJECTS', 'ABOUT', 'SKILLS', 'CONTACT', 'CREDITS']
    : ['PROJECTS', 'ABOUT', 'SKILLS', 'CONTACT'];

  const projects: Project[] = [
    {
      id: 'tomo',
      name: 'TOMO',
      subtitle: 'AI Travel Companion',
      year: '2025',
      desc: 'Your AI guide to Japan. ChatGPT meets Google Maps meets local knowledge.',
      tech: ['EXPO', 'TS', 'GPT-4'],
      status: 'BUILDING',
      icon: 'plane',
    },
    {
      id: 'nokturn',
      name: 'NOKTURN',
      subtitle: 'AI Receptionist',
      year: '2024',
      desc: 'Never miss a call. AI answers phones for HVAC contractors.',
      tech: ['ELEVEN', 'REACT', 'NODE'],
      status: 'BUILDING',
      icon: 'phone',
    },
    {
      id: 'studio',
      name: 'STUDIO',
      subtitle: 'Web Development',
      year: '2023+',
      desc: 'Premium websites for contractors. Built to convert.',
      tech: ['NEXT', 'REACT', 'TAIL'],
      status: 'ACTIVE',
      icon: 'browser',
    }
  ];

  const skills = [
    { name: 'REACT/NEXT', level: 9 },
    { name: 'TYPESCRIPT', level: 8 },
    { name: 'NODE.JS', level: 8 },
    { name: 'REACT NATIVE', level: 7 },
    { name: 'AI/LLM', level: 8 },
    { name: 'UI/UX', level: 8 },
  ];

  const colors = {
    lightest: '#9BBC0F',
    light: '#8BAC0F',
    dark: '#306230',
    darkest: '#0F380F'
  };

  // Konami code handler
  const handleKonamiCode = useCallback(() => {
    playSecret();
    setCreditsUnlocked(true);
    changeScreen('credits');
  }, [playSecret]);

  useKonamiCode(handleKonamiCode);

  // Screen transition helper
  const changeScreen = useCallback((newScreen: Screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(newScreen);
      setTimeout(() => {
        setTransitioning(false);
      }, 50);
    }, 150);
  }, []);

  // Boot sequence - only runs once
  useEffect(() => {
    if (screen !== 'boot' || bootedRef.current) return;

    // Phase 1: Flicker effect (CRT power on)
    const flickerTimer = setTimeout(() => {
      setBootPhase('logo');
      playBoot();
    }, 300);

    return () => clearTimeout(flickerTimer);
  }, [screen, playBoot]);

  useEffect(() => {
    if (screen !== 'boot' || bootPhase !== 'logo' || bootedRef.current) return;

    // Phase 2: Logo appears and drops
    const logoTimer = setTimeout(() => {
      setBootPhase('text');
    }, 800);

    return () => clearTimeout(logoTimer);
  }, [screen, bootPhase]);

  useEffect(() => {
    if (screen !== 'boot' || bootPhase !== 'text' || bootedRef.current) return;

    // Phase 3: Boot text sequence
    const bootSequence = [
      '',
      'LOADING...',
      '████████████ OK',
      '',
      'PRESS START'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setBootText(prev => [...prev, bootSequence[i]]);
        i++;
        if (i === bootSequence.length) {
          setBootPhase('ready');
          bootedRef.current = true;
          setHasBooted(true);
        }
      } else {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [screen, bootPhase]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  // Navigation functions
  const goUp = useCallback(() => {
    if (screen === 'menu') {
      setMenuIndex(prev => prev > 0 ? prev - 1 : menuItems.length - 1);
      playBlip();
    } else if (screen === 'projects') {
      setProjectIndex(prev => prev > 0 ? prev - 1 : projects.length - 1);
      playBlip();
    }
  }, [screen, menuItems.length, projects.length, playBlip]);

  const goDown = useCallback(() => {
    if (screen === 'menu') {
      setMenuIndex(prev => prev < menuItems.length - 1 ? prev + 1 : 0);
      playBlip();
    } else if (screen === 'projects') {
      setProjectIndex(prev => prev < projects.length - 1 ? prev + 1 : 0);
      playBlip();
    }
  }, [screen, menuItems.length, projects.length, playBlip]);

  const pressA = useCallback(() => {
    if (screen === 'boot' && bootPhase === 'ready') {
      playSelect();
      changeScreen('menu');
    } else if (screen === 'menu') {
      playSelect();
      const selected = menuItems[menuIndex];
      if (selected === 'PROJECTS') changeScreen('projects');
      else if (selected === 'ABOUT') changeScreen('about');
      else if (selected === 'SKILLS') changeScreen('skills');
      else if (selected === 'CONTACT') changeScreen('contact');
      else if (selected === 'CREDITS') changeScreen('credits');
    } else if (screen === 'projects') {
      playSelect();
      setSelectedProject(projects[projectIndex]);
      changeScreen('project-detail');
    }
  }, [screen, bootPhase, menuItems, menuIndex, projectIndex, projects, playSelect, changeScreen]);

  const pressB = useCallback(() => {
    if (['projects', 'about', 'skills', 'contact', 'credits'].includes(screen)) {
      playBack();
      changeScreen('menu');
    } else if (screen === 'project-detail') {
      playBack();
      changeScreen('projects');
      setSelectedProject(null);
    }
  }, [screen, playBack, changeScreen]);

  // Keyboard controls - using refs to avoid stale closures
  const goUpRef = useRef(goUp);
  const goDownRef = useRef(goDown);
  const pressARef = useRef(pressA);
  const pressBRef = useRef(pressB);

  useEffect(() => {
    goUpRef.current = goUp;
    goDownRef.current = goDown;
    pressARef.current = pressA;
    pressBRef.current = pressB;
  }, [goUp, goDown, pressA, pressB]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.key === 'ArrowUp') {
        goUpRef.current();
        e.preventDefault();
      }
      else if (e.key === 'ArrowDown') {
        goDownRef.current();
        e.preventDefault();
      }
      else if (e.key === 'Enter' || e.key === ' ' || key === 'a') {
        pressARef.current();
        e.preventDefault();
      }
      else if (e.key === 'Escape' || e.key === 'Backspace' || key === 'b') {
        pressBRef.current();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen content renderer
  const renderScreen = () => {
    // BOOT
    if (screen === 'boot') {
      return (
        <div className={`h-full flex flex-col justify-center items-center text-center ${bootPhase === 'flicker' ? 'animate-flicker' : ''}`}>
          {bootPhase !== 'flicker' && (
            <>
              <div className={`text-lg font-bold tracking-wider mb-4 ${bootPhase === 'logo' ? 'animate-drop-bounce' : ''}`}>
                ◆ ALEC ◆
              </div>
              {bootPhase !== 'logo' && bootText.map((line, i) => (
                <div key={i} className="leading-relaxed text-xs">
                  {line}
                  {i === bootText.length - 1 && bootPhase === 'ready' && showCursor && (
                    <span className="ml-1">_</span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      );
    }

    // MENU
    if (screen === 'menu') {
      const handleMenuClick = (index: number) => {
        setMenuIndex(index);
        playSelect();
        const selected = menuItems[index];
        if (selected === 'PROJECTS') changeScreen('projects');
        else if (selected === 'ABOUT') changeScreen('about');
        else if (selected === 'SKILLS') changeScreen('skills');
        else if (selected === 'CONTACT') changeScreen('contact');
        else if (selected === 'CREDITS') changeScreen('credits');
      };

      return (
        <div className="h-full flex flex-col">
          <div className="text-center mb-4 pt-2">
            <div className="text-lg font-bold tracking-widest">ALEC</div>
            <div className="text-xs opacity-70">DEVELOPER</div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {menuItems.map((item, i) => (
              <button
                key={item}
                onClick={() => handleMenuClick(i)}
                onMouseEnter={() => setMenuIndex(i)}
                className="py-2 px-4 flex items-center transition-colors text-left w-full"
                style={{
                  background: menuIndex === i ? colors.dark : 'transparent',
                  color: colors.lightest
                }}
              >
                <span className="w-6">{menuIndex === i ? '▶' : ''}</span>
                <span>{item}</span>
                {item === 'CREDITS' && <span className="ml-2 text-xs">★</span>}
              </button>
            ))}
          </div>
          <div className="text-center text-xs opacity-50 pb-2">
            v11 • 2025
          </div>
        </div>
      );
    }

    // PROJECTS
    if (screen === 'projects') {
      const handleProjectClick = (index: number) => {
        setProjectIndex(index);
        playSelect();
        setSelectedProject(projects[index]);
        changeScreen('project-detail');
      };

      return (
        <div className="h-full flex flex-col">
          <div className="text-xs opacity-70 mb-2 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">◀ PROJECTS</button>
            <span>B:BACK</span>
          </div>
          <div className="flex-1">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleProjectClick(i)}
                onMouseEnter={() => setProjectIndex(i)}
                className="py-2 px-2 mb-1 flex items-center justify-between transition-colors w-full text-left"
                style={{
                  background: projectIndex === i ? colors.dark : 'transparent'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 text-xs">{projectIndex === i ? '▶' : ''}</span>
                  <PixelIcon type={p.icon} size={16} />
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs opacity-70">{p.subtitle}</div>
                  </div>
                </div>
                <div className="text-xs opacity-50">{p.year}</div>
              </button>
            ))}
          </div>
          <div className="text-xs text-center opacity-50">CLICK OR A:SELECT</div>
        </div>
      );
    }

    // PROJECT DETAIL
    if (screen === 'project-detail' && selectedProject) {
      return (
        <div className="h-full flex flex-col">
          <div className="text-xs opacity-70 mb-3 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">◀ {selectedProject.name}</button>
            <button onClick={pressB} className="hover:opacity-80">B:BACK</button>
          </div>
          <div className="flex-1 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <PixelIcon type={selectedProject.icon} size={20} />
              <div className="font-bold text-base">{selectedProject.name}</div>
            </div>
            <div className="text-xs opacity-70 mb-3">{selectedProject.subtitle}</div>

            <div className="mb-3 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse-glow"
                style={{background: colors.lightest}}
              />
              <span className="text-xs">{selectedProject.status}</span>
            </div>

            <div className="text-xs leading-relaxed mb-3 opacity-90">
              {selectedProject.desc}
            </div>

            <div className="flex flex-wrap gap-1">
              {selectedProject.tech.map(t => (
                <span
                  key={t}
                  className="text-xs px-2 py-1"
                  style={{ border: `1px solid ${colors.light}` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ABOUT
    if (screen === 'about') {
      return (
        <div className="h-full flex flex-col">
          <div className="text-xs opacity-70 mb-3 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">◀ ABOUT</button>
            <button onClick={pressB} className="hover:opacity-80">B:BACK</button>
          </div>
          <div className="flex-1 text-xs leading-relaxed space-y-3">
            <p>I build apps and websites that solve real problems.</p>
            <p>11 ventures. Most failed. Each one taught me what actually works.</p>
            <p>Now I focus on:</p>
            <p>→ Apps that help people</p>
            <p>→ Sites that convert</p>
            <p className="opacity-50 pt-2">Florida, USA</p>
          </div>
        </div>
      );
    }

    // SKILLS
    if (screen === 'skills') {
      return (
        <div className="h-full flex flex-col">
          <div className="text-xs opacity-70 mb-3 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">◀ SKILLS</button>
            <button onClick={pressB} className="hover:opacity-80">B:BACK</button>
          </div>
          <div className="flex-1 space-y-2">
            {skills.map(skill => (
              <div key={skill.name} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>{skill.name}</span>
                  <span className="opacity-50">{skill.level}</span>
                </div>
                <div className="h-2 w-full" style={{ background: colors.dark }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${skill.level * 10}%`,
                      background: colors.lightest
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // CONTACT
    if (screen === 'contact') {
      return (
        <div className="h-full flex flex-col">
          <div className="text-xs opacity-70 mb-3 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">◀ CONTACT</button>
            <button onClick={pressB} className="hover:opacity-80">B:BACK</button>
          </div>
          <div className="flex-1 flex flex-col justify-center text-center">
            <div className="text-sm mb-6">Let&apos;s work together.</div>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:hello@alec.dev"
                className="block py-2 px-4 border transition-opacity hover:opacity-80"
                style={{borderColor: colors.light}}
              >
                EMAIL
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 px-4 border opacity-70 transition-opacity hover:opacity-100"
                style={{borderColor: colors.dark}}
              >
                TWITTER
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 px-4 border opacity-70 transition-opacity hover:opacity-100"
                style={{borderColor: colors.dark}}
              >
                GITHUB
              </a>
            </div>
          </div>
        </div>
      );
    }

    // CREDITS (Easter Egg)
    if (screen === 'credits') {
      return (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="text-xs opacity-70 mb-3 flex justify-between">
            <button onClick={pressB} className="hover:opacity-80">★ CREDITS</button>
            <button onClick={pressB} className="hover:opacity-80">B:BACK</button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-credits-scroll absolute inset-0 flex flex-col items-center text-center text-xs space-y-4 pt-[100%]">
              <div className="border-2 border-current p-3">
                <div className="font-bold mb-2">CREDITS</div>
              </div>
              <div className="h-8" />
              <div>DEVELOPED BY</div>
              <div className="font-bold">ALEC</div>
              <div className="h-8" />
              <div>POWERED BY</div>
              <div>REACT • NEXT.JS</div>
              <div>TAILWIND CSS</div>
              <div className="h-8" />
              <div>INSPIRED BY</div>
              <div>NINTENDO 1989</div>
              <div>PIXEL ART ERA</div>
              <div className="h-8" />
              <div>SPECIAL THANKS</div>
              <div>COFFEE</div>
              <div>LATE NIGHTS</div>
              <div className="h-8" />
              <div className="opacity-50">YOU FOUND</div>
              <div className="opacity-50">THE SECRET!</div>
              <div className="h-8" />
              <div className="font-bold">THANKS FOR</div>
              <div className="font-bold">PLAYING!</div>
              <div className="h-8" />
              <div className="text-xs opacity-50">EST. 2025</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 safe-area-bottom"
      style={{ background: '#1a1a2e' }}
    >
      {/* Gameboy Device */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(145deg, #c8c8c8 0%, #a0a0a0 50%, #888888 100%)',
          borderRadius: '10px 10px 30px 30px',
          padding: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
          width: '320px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Top line accent */}
        <div
          className="absolute top-0 left-8 right-8 h-2 rounded-b"
          style={{ background: '#8b2252' }}
        />

        {/* Screen housing */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{
            background: 'linear-gradient(145deg, #4a4a5c 0%, #3a3a4a 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {/* Screen bezel */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{background: '#9b1b30'}}/>
              <span className="text-xs text-gray-400 tracking-widest font-bold">PORTFOLIO</span>
            </div>
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors p-1"
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {/* Actual screen */}
          <div
            ref={screenRef}
            className={`relative overflow-hidden ${!hasBooted && bootPhase === 'flicker' ? '' : ''}`}
            style={{
              background: colors.darkest,
              padding: '8px',
              borderRadius: '4px',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
              height: '260px'
            }}
          >
            {/* Transition overlay */}
            <div
              className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-150 ${transitioning ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: colors.darkest }}
            />

            {/* Screen content */}
            <div
              className="h-full overflow-hidden relative font-pixel"
              style={{
                color: colors.lightest,
                fontSize: '10px'
              }}
            >
              {renderScreen()}
            </div>

            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
              }}
            />

            {/* Screen glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(155,188,15,0.1) 0%, transparent 50%)'
              }}
            />
          </div>
        </div>

        {/* Brand text */}
        <div className="text-center mb-4">
          <span
            className="text-sm font-bold tracking-widest"
            style={{
              color: '#1a1a8c',
              fontStyle: 'italic',
              textShadow: '1px 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            ALEC<span className="text-xs">dev</span>
          </span>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-start px-2">
          {/* D-Pad */}
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: '#2a2a2a' }}
            />
            {/* Up */}
            <button
              onClick={goUp}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center active:brightness-75 transition-all"
              style={{
                background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
                borderRadius: '4px 4px 0 0'
              }}
              aria-label="Up"
            >
              <span className="text-gray-500 text-xs">▲</span>
            </button>
            {/* Down */}
            <button
              onClick={goDown}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center active:brightness-75 transition-all"
              style={{
                background: 'linear-gradient(0deg, #3a3a3a 0%, #2a2a2a 100%)',
                borderRadius: '0 0 4px 4px'
              }}
              aria-label="Down"
            >
              <span className="text-gray-500 text-xs">▼</span>
            </button>
            {/* Left */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
              style={{
                background: 'linear-gradient(90deg, #3a3a3a 0%, #2a2a2a 100%)',
                borderRadius: '4px 0 0 4px'
              }}
              aria-label="Left"
            >
              <span className="text-gray-500 text-xs">◀</span>
            </button>
            {/* Right */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
              style={{
                background: 'linear-gradient(-90deg, #3a3a3a 0%, #2a2a2a 100%)',
                borderRadius: '0 4px 4px 0'
              }}
              aria-label="Right"
            >
              <span className="text-gray-500 text-xs">▶</span>
            </button>
            {/* Center */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8"
              style={{ background: '#2a2a2a' }}
            />
          </div>

          {/* A/B Buttons */}
          <div className="flex gap-3 items-center" style={{ transform: 'rotate(-25deg)' }}>
            <div className="flex flex-col items-center">
              <button
                onClick={pressB}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #9b1b30 0%, #7a1528 100%)',
                  boxShadow: '0 4px 0 #5a1020, 0 6px 10px rgba(0,0,0,0.3)',
                  color: '#2a0a10'
                }}
                aria-label="B button - Back"
              >
                B
              </button>
              <span className="text-xs text-gray-600 mt-1">B</span>
            </div>
            <div className="flex flex-col items-center -mt-4">
              <button
                onClick={pressA}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #9b1b30 0%, #7a1528 100%)',
                  boxShadow: '0 4px 0 #5a1020, 0 6px 10px rgba(0,0,0,0.3)',
                  color: '#2a0a10'
                }}
                aria-label="A button - Select"
              >
                A
              </button>
              <span className="text-xs text-gray-600 mt-1">A</span>
            </div>
          </div>
        </div>

        {/* Start/Select - Debossed pill slots with labels */}
        <div className="flex justify-center gap-8 mt-6" style={{ transform: 'rotate(-25deg)' }}>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={pressB}
              className="active:translate-y-px transition-transform"
              aria-label="Select"
              style={{
                width: '40px',
                height: '10px',
                borderRadius: '5px',
                background: 'linear-gradient(180deg, #505050 0%, #686868 100%)',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.1)',
              }}
            />
            <span
              className="font-bold"
              style={{
                fontSize: '7px',
                letterSpacing: '0.5px',
                color: '#1a1a8c',
                textShadow: '0.5px 0.5px 0 rgba(255,255,255,0.4)',
              }}
            >
              SELECT
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={pressA}
              className="active:translate-y-px transition-transform"
              aria-label="Start"
              style={{
                width: '40px',
                height: '10px',
                borderRadius: '5px',
                background: 'linear-gradient(180deg, #505050 0%, #686868 100%)',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.1)',
              }}
            />
            <span
              className="font-bold"
              style={{
                fontSize: '7px',
                letterSpacing: '0.5px',
                color: '#1a1a8c',
                textShadow: '0.5px 0.5px 0 rgba(255,255,255,0.4)',
              }}
            >
              START
            </span>
          </div>
        </div>

        {/* Speaker grille */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-1"
              style={{ marginLeft: i % 2 ? '4px' : '0' }}
            >
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#5a5a5a' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard hint - only on desktop */}
      <div className="hidden md:block fixed bottom-4 left-0 right-0 text-center text-white/30 text-xs">
        ↑↓ Navigate • Enter Select • Esc Back • Try the Konami code...
      </div>
    </div>
  );
}
