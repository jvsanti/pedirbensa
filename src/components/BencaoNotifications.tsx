import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Check, X } from 'lucide-react';

interface Bencao {
  id: string;
  nome: string;
  status: string;
  data_resposta: string;
}

interface Notificacao {
  id: string;
  nome: string;
  aprovado: boolean;
  visible: boolean;
}

const BencaoNotifications = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [ultimasBencaos, setUltimasBencaos] = useState<Bencao[]>([]);

  // Carrega as últimas bênçãos ao iniciar
  useEffect(() => {
    const loadUltimasBencaos = async () => {
      const { data } = await supabase
        .from('bencaos')
        .select('*')
        .in('status', ['aprovado', 'negado'])
        .order('data_resposta', { ascending: false })
        .limit(10);

      if (data) {
        setUltimasBencaos(data);
      }
    };

    loadUltimasBencaos();
  }, []);

  // Escuta mudanças em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('bencaos-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bencaos',
        },
        (payload) => {
          const bencao = payload.new as Bencao;
          
          if (bencao.status === 'aprovado' || bencao.status === 'negado') {
            // Adiciona notificação
            const novaNotificacao: Notificacao = {
              id: bencao.id,
              nome: bencao.nome,
              aprovado: bencao.status === 'aprovado',
              visible: true,
            };

            setNotificacoes((prev) => [novaNotificacao, ...prev].slice(0, 5));

            // Remove após 5 segundos
            setTimeout(() => {
              setNotificacoes((prev) =>
                prev.map((n) =>
                  n.id === bencao.id ? { ...n, visible: false } : n
                )
              );
            }, 5000);

            // Remove completamente após animação
            setTimeout(() => {
              setNotificacoes((prev) => prev.filter((n) => n.id !== bencao.id));
            }, 5500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Mostra notificação aleatória das últimas bênçãos a cada 15 segundos
  useEffect(() => {
    if (ultimasBencaos.length === 0) return;

    const showRandomNotification = () => {
      const randomBencao = ultimasBencaos[Math.floor(Math.random() * ultimasBencaos.length)];
      
      const novaNotificacao: Notificacao = {
        id: `random-${Date.now()}`,
        nome: randomBencao.nome,
        aprovado: randomBencao.status === 'aprovado',
        visible: true,
      };

      setNotificacoes((prev) => [novaNotificacao, ...prev].slice(0, 3));

      // Remove após 4 segundos
      setTimeout(() => {
        setNotificacoes((prev) =>
          prev.map((n) =>
            n.id === novaNotificacao.id ? { ...n, visible: false } : n
          )
        );
      }, 4000);

      // Remove completamente após animação
      setTimeout(() => {
        setNotificacoes((prev) => prev.filter((n) => n.id !== novaNotificacao.id));
      }, 4500);
    };

    // Mostra primeira notificação após 5 segundos
    const initialTimeout = setTimeout(showRandomNotification, 5000);
    
    // Depois mostra a cada 7,5 segundos
    const interval = setInterval(showRandomNotification, 7500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [ultimasBencaos]);

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col gap-3 w-80 md:w-96">
      {notificacoes.map((notif) => (
        <div
          key={notif.id}
          className={`
            flex items-center gap-4 px-5 py-4 rounded-xl shadow-2xl
            transition-all duration-500 ease-out
            ${notif.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
            ${notif.aprovado 
              ? 'bg-success/20 border-2 border-success/50' 
              : 'bg-destructive/20 border-2 border-destructive/50'
            }
          `}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
            ${notif.aprovado ? 'bg-success/30' : 'bg-destructive/30'}
          `}>
            {notif.aprovado ? (
              <Check className="w-6 h-6 text-success" />
            ) : (
              <X className="w-6 h-6 text-destructive" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base md:text-lg font-display text-foreground truncate">
              {notif.nome}
            </p>
            <p className={`text-sm md:text-base font-body ${notif.aprovado ? 'text-success' : 'text-destructive'}`}>
              {notif.aprovado ? 'Recebeu a bensa! 🙏' : 'Indigno da bensa! 💀'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BencaoNotifications;
