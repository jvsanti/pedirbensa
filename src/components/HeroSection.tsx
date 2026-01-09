import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="font-body text-xl md:text-2xl italic text-muted-foreground mb-4 animate-float">
          "Nosso desprezo aos <span className="text-primary font-bold">BURROS</span>"
        </p>
        
        <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
          <span className="italic text-foreground">Informações</span>
          <br />
          <span className="text-gradient glow-text">Importantes</span>
          <br />
          <span className="italic text-foreground">aos</span>
          <br />
          <span className="text-gradient glow-text text-5xl md:text-7xl lg:text-9xl">BURROS</span>
        </h1>

        <div className="flex justify-center gap-8 md:gap-16 mt-8 mb-8">
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-4xl text-primary italic">Teu tio</h2>
            <p className="text-muted-foreground text-sm">O Brutamontes</p>
          </div>
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-4xl text-primary italic">Teu pai</h2>
            <p className="text-muted-foreground text-sm">O Sábio</p>
          </div>
        </div>

        <h3 className="font-display text-2xl md:text-3xl tracking-widest text-foreground/90 mb-8">
          LEIA ATENTAMENTE O DECRETO SUPREMO E SOLICITE A SUA BENSA
        </h3>

        <a 
          href="#pedir-bencao"
          className="btn-decree inline-block px-8 py-4 rounded-lg font-display text-lg text-primary-foreground uppercase tracking-wider"
        >
          Pedir a Bensa
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
