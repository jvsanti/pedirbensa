import { useBencaos } from '@/hooks/useBencaos';
import { Check, X } from 'lucide-react';

const ListaBencaos = () => {
  const { bencaos, loading } = useBencaos();

  const aprovados = bencaos.filter(b => b.status === 'aprovado');
  const negados = bencaos.filter(b => b.status === 'negado');

  if (loading) {
    return null;
  }

  if (aprovados.length === 0 && negados.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
          <span className="text-gradient">Registro das Bensas</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Aprovados */}
          <div className="card-decree rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-display text-xl text-success">Abençoados</h3>
            </div>

            {aprovados.length === 0 ? (
              <p className="text-muted-foreground italic font-body text-center py-4">
                Nenhum digno ainda...
              </p>
            ) : (
              <ul className="space-y-3">
                {aprovados.map((b) => (
                  <li key={b.id} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
                    <Check className="w-4 h-4 text-success mt-1 shrink-0" />
                    <div>
                      <p className="font-display text-sm text-foreground">{b.nome}</p>
                      <p className="text-xs text-muted-foreground font-body">{b.motivo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Negados */}
          <div className="card-decree rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-display text-xl text-destructive">Indignos</h3>
            </div>

            {negados.length === 0 ? (
              <p className="text-muted-foreground italic font-body text-center py-4">
                Nenhum reprovado ainda...
              </p>
            ) : (
              <ul className="space-y-3">
                {negados.map((b) => (
                  <li key={b.id} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <X className="w-4 h-4 text-destructive mt-1 shrink-0" />
                    <div>
                      <p className="font-display text-sm text-foreground line-through opacity-70">{b.nome}</p>
                      <p className="text-xs text-muted-foreground font-body">{b.motivo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListaBencaos;
