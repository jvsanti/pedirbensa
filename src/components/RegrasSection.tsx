import { Shield, Sword, Target, Skull, Crown } from 'lucide-react';

const regras = [
  {
    icon: Crown,
    titulo: "Respeite a Hierarquia",
    descricao: "Teu pai e Teu Tio são os seres supremos. ADCs e demais criaturas devem se curvar. Briguem entre vocês."
  },
  {
    icon: Sword,
    titulo: "Ataque Psicológico",
    descricao: "Use palavras como armas. O chat é seu campo de batalha secundário."
  },
  {
    icon: Target,
    titulo: "Foco no Desespero",
    descricao: "O objetivo é fazer os adversários perderem a vontade de jogar. Mesmo que você esteja 0/10, tilte-os!"
  },
  {
    icon: Shield,
    titulo: "ADC é Sacrificável",
    descricao: "O ADC existe para sofrer. Não gaste recursos preciosos salvando-o. Deixe-os perecer!"
  },
  {
    icon: Skull,
    titulo: "Não seja BURRO",
    descricao: "Faça o mínimo e fique quieto. Peça a bensa e aproveite seus PDL's."
  }
];

const RegrasSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-4">
          <span className="text-gradient">Regras Sagradas</span>
        </h2>
        <p className="text-center text-muted-foreground font-body italic mb-12">
          Não seja burro!
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regras.map((regra, index) => (
            <div 
              key={index}
              className="card-decree rounded-xl p-6 hover:border-primary/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <regra.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{regra.titulo}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {regra.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegrasSection;
