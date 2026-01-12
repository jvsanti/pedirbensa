import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const FireParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajusta tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const colors = [
      'rgba(220, 38, 38, ', // Vermelho
      'rgba(249, 115, 22, ', // Laranja
      'rgba(234, 179, 8, ',  // Amarelo
      'rgba(139, 0, 0, ',    // Vermelho escuro
    ];

    // Cria partículas
    const createParticle = (): Particle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 4 + 2,
        speedY: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.6 + 0.2,
        color,
        life: 0,
        maxLife: Math.random() * 150 + 100,
      };
    };

    // Inicializa partículas
    for (let i = 0; i < 50; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    // Loop de animação
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Atualiza posição
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.life * 0.05) * 0.3;
        p.life++;

        // Fade out conforme sobe
        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio);

        // Diminui tamanho conforme sobe
        const currentSize = p.size * (1 - lifeRatio * 0.5);

        // Desenha partícula com glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2);
        gradient.addColorStop(0, p.color + currentOpacity + ')');
        gradient.addColorStop(0.5, p.color + currentOpacity * 0.5 + ')');
        gradient.addColorStop(1, p.color + '0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, currentSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Reseta partícula quando morre ou sai da tela
        if (p.life >= p.maxLife || p.y < -20) {
          particles[index] = createParticle();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default FireParticles;
