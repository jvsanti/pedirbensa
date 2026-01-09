import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DecretoConteudo {
  id: string;
  secao: string;
  titulo: string;
  conteudo: string;
}

export const useDecretoConteudo = () => {
  const [conteudo, setConteudo] = useState<DecretoConteudo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConteudo = async () => {
    const { data, error } = await supabase
      .from('decreto_conteudo')
      .select('*');

    if (data) {
      setConteudo(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConteudo();
  }, []);

  const getSecao = (secao: string) => {
    return conteudo.find(c => c.secao === secao);
  };

  return { conteudo, loading, getSecao };
};
