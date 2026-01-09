import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFaqs = async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('ordem');

    if (data) {
      setFaqs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  return { faqs, loading };
};
