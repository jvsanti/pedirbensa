import { useState } from 'react';
import { useBencaos } from '@/hooks/useBencaos';
import { toast } from 'sonner';

const PedirBencaoForm = () => {
  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const { addBencao } = useBencaos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !motivo.trim()) {
      toast.error('Preencha todos os campos, seu burro!');
      return;
    }

    setLoading(true);
    const { error } = await addBencao(nome.trim(), motivo.trim());
    
    if (error) {
      toast.error('Erro ao enviar pedido. Tente novamente!');
    } else {
      toast.success('Pedido de bênção enviado! Aguarde a decisão dos superiores.');
      setNome('');
      setMotivo('');
    }
    setLoading(false);
  };

  return (
    <section id="pedir-bencao" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card-decree rounded-2xl p-8 md:p-12">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-4">
            <span className="text-gradient">Pedir a Bensa</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8 font-body italic">
            Ajoelhe-se perante a nossa grandiosidade e peça a nossa bensa
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-display text-sm uppercase tracking-wider mb-2 text-foreground/80">
                Seu Nome (Invocador)
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como te chamamos, criatura?"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block font-display text-sm uppercase tracking-wider mb-2 text-foreground/80">
                Por que mereces a bensa?
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Convença os Seres Superiores..."
                rows={4}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                maxLength={300}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-decree py-4 rounded-lg font-display text-lg text-primary-foreground uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando súplica...' : 'Implorar pela Bensa'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PedirBencaoForm;
