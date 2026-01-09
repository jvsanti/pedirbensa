import { useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const startMusic = () => {
    setShowOverlay(false);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // URL muda baseado no estado de mute
  const youtubeUrl = `https://www.youtube.com/embed/x7jXLAKLCUM?autoplay=1&loop=1&playlist=x7jXLAKLCUM&controls=0&mute=${isMuted ? 1 : 0}`;

  return (
    <>
      {/* Overlay que cobre TODA a tela - usuário tem que clicar pra entrar */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center cursor-pointer"
          onClick={startMusic}
        >
          <div className="text-center space-y-6 px-4">
            <h1 className="font-display text-4xl md:text-6xl text-gradient">
              Decreto Supremo
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Prepare-se para receber a sabedoria suprema
            </p>
            <button 
              className="btn-decree px-8 py-4 rounded-lg font-display text-lg text-primary-foreground uppercase tracking-wider flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Testemunhe o Decreto
            </button>
            <p className="text-muted-foreground/60 text-sm">
             
            </p>
          </div>
        </div>
      )}

      {/* Botão de controle de áudio (aparece depois de entrar) */}
      {!showOverlay && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleMute}
            className="bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-all"
            title={isMuted ? 'Ativar música' : 'Mutar música'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Player do YouTube oculto - recarrega quando muda o mute */}
      {isPlaying && (
        <iframe
          key={isMuted ? 'muted' : 'unmuted'}
          className="pointer-events-none"
          width="0"
          height="0"
          src={youtubeUrl}
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
    </>
  );
};

export default BackgroundMusic;
