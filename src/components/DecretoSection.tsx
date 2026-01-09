import { useDecretoConteudo } from '@/hooks/useDecretoConteudo';

const DecretoSection = () => {
  const { conteudo, loading } = useDecretoConteudo();

  // Pega o hero (título principal)
  const hero = conteudo.find(c => c.secao === 'hero');
  
  // Pega todas as seções que não são hero (dicas, parágrafos, etc)
  const secoes = conteudo
    .filter(c => c.secao !== 'hero')
    .sort((a, b) => a.secao.localeCompare(b.secao));

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Carregando decreto...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-decree rounded-2xl p-8 md:p-12">
          {/* Título do Decreto */}
          <h2 className="font-display text-3xl md:text-4xl text-center mb-8">
            <span className="text-gradient">{hero?.titulo || 'O Decreto Supremo'}</span>
          </h2>

          <div className="space-y-6 font-body text-lg leading-relaxed text-foreground/90">
            {/* Subtítulo / Introdução */}
            {hero && (
              <p className="text-center italic text-xl">
                {hero.conteudo}
              </p>
            )}

            {/* Seções do decreto (parágrafos, dicas, etc) */}
            {secoes.map((secao) => (
              <div key={secao.id} className="border border-primary/30 rounded-xl p-6 bg-primary/5">
                <h3 className="font-display text-xl text-primary text-center mb-4">
                  {secao.titulo}
                </h3>
                <p className="text-center text-muted-foreground">
                  {secao.conteudo}
                </p>
              </div>
            ))}

            {/* Assinatura */}
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
