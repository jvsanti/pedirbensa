import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Flame, Bomb, Crown, Swords, Axe } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

// Componente de partículas simplificado para o overlay
const OverlayParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number, left: number, delay: number, duration: number, size: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-float-up"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <div 
            className="rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 opacity-60 blur-sm"
            style={{
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const BackgroundMusic = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startMusic = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowOverlay(false);
      setShowPlayer(true);
    }, 500);
  };

  const toggleMusic = () => {
    setShowPlayer(!showPlayer);
  };

  return (
    <>
      {/* Overlay épico de entrada */}
      {showOverlay && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${isAnimating ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
          onClick={startMusic}
        >
          {/* Background com imagem */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBanner})` }}
          />
          
          {/* Overlay escuro com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          
          {/* Borda vermelha brilhante nas laterais */}
          <div className="absolute inset-0 border-[3px] border-primary/30 m-4 rounded-lg" />
          <div className="absolute inset-0 border border-primary/10 m-8 rounded-lg" />
          
          {/* Partículas de fogo */}
          <OverlayParticles />
          
          {/* Conteúdo centralizado */}
          <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl">
            
            {/* Ícones decorativos no topo */}
            <div className="flex justify-center items-center gap-6 mb-4">
              <Axe className="w-8 h-8 text-primary/60 animate-pulse" />
              <Crown className="w-12 h-12 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Bomb className="w-8 h-8 text-primary/60 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Subtítulo */}
            <p className="text-primary/80 font-body text-sm md:text-base tracking-[0.3em] uppercase">
              Teu Pai & Teu Tio apresentam
            </p>
            
            {/* Título principal com glow */}
            <div className="relative">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-800 animate-pulse-glow">
                Decreto
              </h1>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-500 to-red-700 -mt-2">
                Supremo
              </h1>
              {/* Glow effect atrás do texto */}
              <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10" />
            </div>

            {/* Linha decorativa */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <Flame className="w-6 h-6 text-primary animate-bounce" />
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </div>
            
            {/* Descrição */}
            <p className="text-muted-foreground font-body text-lg md:text-xl italic">
              "Prepare-se para receber a sabedoria suprema"
            </p>
            
            {/* Botão de entrada */}
            <button 
              className="group relative btn-decree px-10 py-5 rounded-lg font-display text-lg md:text-xl text-primary-foreground uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)]"
            >
              {/* Brilho animado no botão */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative flex items-center gap-3">
                <Swords className="w-6 h-6" />
                Testemunhar o Decreto
              </span>
            </button>
            
            {/* Aviso de som */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground/60 text-sm">
              <Volume2 className="w-4 h-4" />
              <span>Burros não serão tolerados!</span>
            </div>

            {/* Ícones decorativos embaixo */}
            <div className="flex justify-center items-center gap-8 mt-8 opacity-40">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/60" />
              <Axe className="w-6 h-6 text-primary/60" />
              <Crown className="w-6 h-6 text-primary/60" />
              <Bomb className="w-6 h-6 text-primary/60" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/60" />
            </div>
          </div>
        </div>
      )}

      {/* Botão de controle de áudio (aparece depois de entrar) */}
      {!showOverlay && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleMusic}
            className="bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-all hover:scale-110"
            title={showPlayer ? 'Pausar música' : 'Tocar música'}
          >
            {showPlayer ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Player do YouTube oculto */}
      {showPlayer && (
        <iframe
          className="pointer-events-none"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/x7jXLAKLCUM?autoplay=1&loop=1&playlist=x7jXLAKLCUM&controls=0"
          title="Background Music"
          allow="autoplay; encrypted-media"
          style={{ 
            position: 'fixed', 
            left: '-9999px',
            top: '-9999px',
            opacity: 0,
          }}
        />
      )}

      {/* CSS para animações customizadas */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
        
        .animate-float-up {
          animation: float-up linear infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(220, 38, 38, 0.8));
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default BackgroundMusic;
