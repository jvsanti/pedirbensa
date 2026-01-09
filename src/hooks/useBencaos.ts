import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Bencao {
  id: string;
  nome: string;
  motivo: string;
  status: string;
  data_envio: string;
  data_resposta: string | null;
}

export const useBencaos = () => {
  const [bencaos, setBencaos] = useState<Bencao[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBencaos = async () => {
    const { data, error } = await supabase
      .from('bencaos')
      .select('*')
      .in('status', ['aprovado', 'negado'])
      .order('data_resposta', { ascending: false });

    if (data) {
      setBencaos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBencaos();

    const channel = supabase
      .channel('bencaos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bencaos',
        },
        () => {
          loadBencaos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBencao = async (nome: string, motivo: string) => {
    const { error } = await supabase.from('bencaos').insert({ nome, motivo });
    return { error };
  };

  return { bencaos, loading, addBencao, refetch: loadBencaos };
};
