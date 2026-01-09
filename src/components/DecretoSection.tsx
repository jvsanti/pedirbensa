const DecretoSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-decree rounded-2xl p-8 md:p-12">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-8">
            <span className="text-gradient">O Decreto Supremo</span>
          </h2>

          <div className="space-y-6 font-body text-lg leading-relaxed text-foreground/90">
            <p className="text-center italic text-xl">
              Ouçam bem, vermes do nosso time, é hora de cumprirem o seu papel na disseminação do caos!
            </p>

            <p>
              Suas palavras venenosas são armas poderosas, destinadas a dilacerar o psicológico dos adversários 
              e fazer com que eles sonhem conosco. Em todas as interações com os inimigos, vocês devem lançar 
              insultos como bombas. Chamem-nos de burros, idiotas, criaturas inferiores e todos os sinônimos 
              de burrice que puderem imaginar.
            </p>

            <p>
              Desestabilizem suas mentes frágeis e mostrem a eles o quão insignificantes são diante da nossa grandeza.
              Vocês são os mensageiros do nosso poder avassalador, as vozes do pesadelo que assombra os sonhos dos adversários.
            </p>

            <div className="border border-primary/30 rounded-xl p-6 bg-primary/5 mt-8">
              <h3 className="font-display text-xl text-primary text-center mb-4">DICAS DE OFENSA:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center">
                {['BURRO', 'Imbecis', 'Idiotas', 'Incompetentes', 'Estúpidos', 'Ignorantes', 
                  'Fracassados', 'Tolos', 'Patéticos', 'Insossos', 'Ridículos'].map((palavra) => (
                  <span key={palavra} className="text-muted-foreground hover:text-primary transition-colors">
                    {palavra}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center italic text-muted-foreground mt-8">
              AGRADECEMOS A VOSSA BURRA COMPREENSÃO.
              <br />
              ASSINADO: <span className="text-primary">TEU PAI E TEU TIO</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecretoSection;
