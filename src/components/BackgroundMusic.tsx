import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Detecta qualquer interação do usuário (clique, scroll, tecla)
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsMuted(false);
      }
    };

    // Adiciona listeners para várias formas de interação
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // URL do YouTube com parâmetros
  // mute=1 ou mute=0 controla o áudio
  const youtubeUrl = `https://www.youtube.com/embed/x7jXLAKLCUM?autoplay=1&loop=1&playlist=x7jXLAKLCUM&controls=0&mute=${isMuted ? 1 : 0}&enablejsapi=1`;

  return (
    <>
      {/* Botão de controle de áudio */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMute}
          className="bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-all"
          title={isMuted ? 'Ativar música' : 'Pausar música'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        {isMuted && !hasInteracted && (
          <span className="absolute -top-8 right-0 bg-background/90 text-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
            Clique para ativar ♪
          </span>
        )}
      </div>

      {/* Player do YouTube oculto - sempre carregado */}
      <iframe
        ref={iframeRef}
        key={isMuted ? 'muted' : 'unmuted'} // Força reload quando muda mute
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
    </>
  );
};

export default BackgroundMusic;
