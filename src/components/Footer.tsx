const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-display text-xl text-primary mb-2">
          Decreto dos Burros
        </p>
        <p className="font-body italic text-muted-foreground text-sm">
          "Que suas ofensas ecoem como trovões, provocando medo e desespero naqueles que se atrevem a nos desafiar."
        </p>
        <p className="text-xs text-muted-foreground/50 mt-6">
          © {new Date().getFullYear()} Teu Pai e Teu Tio. Todos os direitos reservados aos superiores.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
